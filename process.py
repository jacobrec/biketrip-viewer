import xml.etree.ElementTree as ET
from multiprocessing import Pool
from geopy import distance
import struct
from dateutil import parser
import glob
import json


class Activity:
    def __init__(self, starttime, name, track):
        self.starttime = starttime
        self.name = name
        self.track = track
        self.totalDistance = 0
        self.totalTime = 0
        self.totalElevation = 0
        self.averageSpeed = 0
        self.topSpeed = 0

    def __str__(self):
        points = [str(x) for x in self.track]
        show = 8
        if len(points) > show:
            points = points[0:show-2] + ["..."] + [points[-1]]
        points = "\n".join(points)
        return "{} ({}):\nDistance: {}km\nElevation: {}m\nTime: {}m\nMax Speed: {}km/h\n".format(
                self.name, self.starttime,
                self.totalDistance / 1000,
                self.totalElevation,
                self.totalTime / 60,
                self.topSpeed * 3.6)

    def __repr__(self):
        return str(self)

    def addSpeeds(self):
        def computeDistance(p1, p2):
            return distance.distance((p1.lat, p1.lon), (p2.lat, p2.lon)).meters
        n = 10
        for i in range(n):
            self.track[i].speed = 0
            self.track[i].grade = 0
        self.topSpeed = 0
        for i in range(n, len(self.track)):
            p1 = self.track[i-n]
            p2 = self.track[i]
            deltat = p2.time - p1.time
            deltae = p2.ele - p1.ele
            dist = computeDistance(p1, p2)
            if p2.ele > p1.ele:
                self.totalElevation += deltae / n
            self.totalDistance += dist / n
            self.totalTime += deltat / n
            self.track[i].speed = dist / deltat
            self.track[i].grade = deltae / dist if dist != 0 else 0
            # Cleanup speeds
            if self.track[i].speed > 21:
                self.track[i].speed = self.track[i-1].speed
            self.topSpeed = max(self.track[i].speed, self.topSpeed)

        self.averageSpeed = self.totalDistance / self.totalTime






    def fromBinaryFile(filename):
        f = open(filename, 'rb')
        namelen = struct.unpack("i", f.read(4))[0]
        name = f.read(namelen).decode("utf-8")
        starttime = struct.unpack("i", f.read(4))[0]
        track = []
        try:
            while True:
                lat, lon, ele, time = struct.unpack("fffi", f.read(4*4))
                track.append(DataPoint(lat, lon, ele, time))
        except:
            pass
        f.close()
        return Activity(starttime, name, track)
    def toBinaryFile(self, filename):
        f = open(filename, 'wb+')
        name = bytearray(self.name, "utf-8")
        namelen = len(name)
        start = self.starttime
        points = [struct.pack("fffi", x.lat, x.lon, x.ele, x.time) for x in self.track]
        f.write(struct.pack("i", namelen))
        f.write(name)
        f.write(struct.pack("i", start))
        for p in points:
            f.write(p)
        f.close()

class DataPoint:
    def __init__(self, lat, lon, ele, time, speed=0.0):
        self.lat = lat
        self.lon = lon
        self.time = time
        self.ele = ele
        self.speed = speed

    def __str__(self):
        return "<({},{},{}) at {} going {}m/s>".format(self.lat, self.lon, self.ele, self.time, self.speed)

    def __repr__(self):
        return str(self)

def parseTime(timestr):
    return int(parser.parse(timestr).timestamp())


def parsePoint(point):
    return DataPoint(
            float(point.attrib["lat"]),
            float(point.attrib["lon"]),
            float(point[0].text),
            parseTime(point[1].text))


def parseFile(filename):
    tree = ET.parse(filename)
    root = tree.getroot()
    starttime = parseTime(root[0][0].text)
    name = root[1][0].text
    points = [parsePoint(x) for x in root[1][2]]
    return Activity(starttime, name, points)

def loadFile(filename):
    # Load file
    act = None
    if filename.endswith(".bin"):
        act = Activity.fromBinaryFile(filename)
    elif filename.endswith(".gpx"):
        act = parseFile(filename)
    act.addSpeeds()
    print("Loaded file '{}'".format(filename))
    print(act)
    return act


skipRes = 100
class ActivityGroup():
    def __init__(self, activities):
        self.activities = activities
        self.track = []
        dayIdx = [0]
        self.names = ["Vancouver"]
        self.provinces = [("BC", 0)]
        self.distances = []
        self.elevations = []
        self.times = []
        self.topspeeds = []
        self.averagespeeds = []
        for a in activities:
            try:
                tt = a.track[::skipRes]
                idx = dayIdx[-1]
                self.track += tt
                self.distances.append(a.totalDistance)
                self.elevations.append(a.totalElevation)
                self.topspeeds.append(a.topSpeed)
                self.averagespeeds.append(a.averageSpeed)
                self.times.append(a.totalTime)
                dayIdx.append(len(tt) + idx)
                lastProvince = self.provinces[-1][0]
                province = a.name.split(":")[1][1:].split("-")[0].strip()
                where = "-".join(a.name.split("-")[1:]).strip().split(" to ")
                if self.names[-1] != where[0]:
                    where[0] = self.names[-1] + "/" + where[0]
                    self.names[-1] = where[0]
                self.names.append(where[1])
                if lastProvince != province:
                    self.provinces.append((province, idx))
                print(province, where)
            except:
                print("Error", a.name, a)
        self.dayIdx = dayIdx
        print(self.names)

    def generateFiles(self, path):
        def exportFile(name, dataformat, getData):
            f = open(path + name, 'wb+')
            for p in self.track:
                f.write(struct.pack(dataformat, *getData(p)))
            f.close()

        exportFile("loc", "ff", lambda x: [x.lat, x.lon])
        exportFile("ele", "f", lambda x: [x.ele])
        exportFile("time", "i", lambda x: [x.time])
        exportFile("speed", "f", lambda x: [x.speed])

        data = {}
        data["locations"] = self.names
        data["provinces"] = self.provinces
        data["days"] = self.dayIdx
        data["distances"] = self.distances
        data["elevations"] = self.elevations
        data["times"] = self.times
        data["topspeeds"] = self.topspeeds
        data["averagespeeds"] = self.averagespeeds
        f = open(path + "info", 'w+')
        f.write(json.dumps(data, indent=4))
        f.close()




def createSuperFileFromGPX(globpath, export):
    files = glob.glob(globpath)
    files.sort(key=lambda x: int(x[len("bike_across_canada/Day_"):].split("_")[0]))
    with Pool(4) as p:
        activities = p.map(loadFile, files)
    activites = [x for x in activities]
    acts = ActivityGroup(activities)
    acts.generateFiles(export)


createSuperFileFromGPX("bike_across_canada/*", "gen_data/")
