# Purpose: translates the source .csv file into .kml format

#
# Usage Example:
#   python csv-to-kml.py -s mental-health.csv -d mental-health.kml
#

import re
import csv
import cgi
import argparse

#------------------------------------------------------------------------------
# Constants
#------------------------------------------------------------------------------

NUM_HEADER_ROWS = 1;
SRC_DELIMETER = "|"
DEST_DELIMETER = ", "


#------------------------------------------------------------------------------
# Classes
#------------------------------------------------------------------------------


class Record:
  def __init__(self):
    self.MHSU_GUID = None
    self.GPCE_TAXONOMY_CLASSIFICATION = None
    self.AUDIENCE = None
    self.STUDENT = None
    self.TAXONOMY_NAME = None
    self.RG_NAME = None
    self.SV_NAME = None
    self.SV_DESCRIPTION = None
    self.PHONE_NUMBER = None
    self.WEBSITE = None
    self.EMAIL_ADDRESS = None
    self.WHEELCHAIR_ACCESSIBLE = None
    self.LANGUAGE = None 
    self.HOURS = None
    self.STREET_NUMBER = None
    self.CITY = None
    self.PROVINCE = None
    self.POSTAL_CODE = None
    self.LATITUDE = None 
    self.LONGITUDE = None
    self.MHSU_SPECIFIC_TERMS_ENHANCED_SEARCH = None
    self.KEYWORD_SEARCH_TEXT = None

  def hasLocation(self):
    if (self.LATITUDE and self.LONGITUDE):
      return True
    return False

  def isLocationValid(self):
    lat = float(self.LATITUDE)
    lon = float(self.LONGITUDE)

    #note: these are approximate bounds for BC.  they are not exact.
    if (lon < -140 or lon > -110 or lat < 48 or lat > 60):
      return False
    return True
      

  def formatGpceTaxonomyClassification(self):
    return self.GPCE_TAXONOMY_CLASSIFICATION.replace(SRC_DELIMETER, DEST_DELIMETER)

  def formatAudience(self):
    if SRC_DELIMETER in self.AUDIENCE:
      return ""
    else:
      s = self.AUDIENCE
      if s != "":
        s += " Only"
      return s

  def formatTaxonomyName(self):
    return self.TAXONOMY_NAME.replace(SRC_DELIMETER, DEST_DELIMETER)



#------------------------------------------------------------------------------
# Functions
#------------------------------------------------------------------------------

def clean(s):
  text = s.strip()
  text = cgi.escape(text)
  text = text.replace("","'")
  text = text.replace("", "-")
  text = text.decode('ISO-8859-2').encode("utf-8")
  return text

def formatPhone(s):
  formatted = s
  if len(s) == 10:
    formatted = "("+s[0:3]+") "+s[3:6]+"-"+s[6:]
  return formatted

def formatUrl(s):
  u = s.upper().strip();
  formatted = s
  if u != "" and not u.startswith("HTTP://") and not u.startswith("HTTPS://"):
    formatted = "http://"+s.strip()
  
  return formatted

def csvRowToRecord(csvRow):
  rec = Record()																	
  
  rec.MHSU_GUID = clean(csvRow[0])
  rec.GPCE_TAXONOMY_CLASSIFICATION = clean(csvRow[1])
  rec.AUDIENCE = clean(csvRow[2])
  rec.STUDENT = clean(csvRow[3])
  rec.TAXONOMY_NAME = clean(csvRow[4])
  rec.RG_NAME = clean(csvRow[5])
  rec.SV_NAME = clean(csvRow[5])
  rec.SV_DESCRIPTION = clean(csvRow[7])
  rec.PHONE_NUMBER = clean(csvRow[8])
  rec.WEBSITE = clean(csvRow[9])
  rec.EMAIL_ADDRESS = clean(csvRow[10])
  rec.WHEELCHAIR_ACCESSIBLE = clean(csvRow[11])
  rec.LANGUAGE = clean(csvRow[12]) 
  rec.HOURS = clean(csvRow[13])
  rec.STREET_NUMBER = clean(csvRow[14])
  rec.CITY = clean(csvRow[15])
  rec.PROVINCE = clean(csvRow[16])
  rec.POSTAL_CODE = clean(csvRow[17])
  rec.LATITUDE = clean(csvRow[18]) 
  rec.LONGITUDE = clean(csvRow[19])
  rec.MHSU_SPECIFIC_TERMS_ENHANCED_SEARCH = clean(csvRow[20])
  rec.KEYWORD_SEARCH_TEXT = clean(csvRow[21])

  return rec

def getHeader():
  return """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
  <Style id="marker">
    <IconStyle>
      <scale>1.0</scale>
      <Icon>
        <href>http://maps.google.com/mapfiles/marker_yellow.png</href>
      </Icon>
    </IconStyle>
    <LabelStyle/>
    <BalloonStyle>
      <text>$[description]</text>
    </BalloonStyle>
  </Style>

  """

def getFooter():
  return """</Document>
</kml>
"""

def getRow(record):
  
  #---------------- init ----------------

  if (record.LATITUDE == None) or (record.LATITUDE == "") or (record.LONGITUDE == None) or (record.LONGITUDE == ""):
    return None

  #derived attributes
  styleName = "marker"

  displayTitle = record.SV_NAME
  if record.WEBSITE:
    displayTitle = "<a href='"+formatUrl(record.WEBSITE)+"' target='_blank'>"+record.SV_NAME+"</a>"

  wheelchairAccessible = "<strong>Wheelchair accessible:</strong> "+record.WHEELCHAIR_ACCESSIBLE+"<br/>"

  languages = ""
  if record.LANGUAGE:
    languages = "<strong>Language(s):</strong> "+record.LANGUAGE+"<br/>"

  hours = ""
  if record.HOURS:
    hours = "<strong>Hours:</strong> "+clean(record.HOURS)+ "<br/>"

  addressHtml = ""
  addressText = ""
  if record.STREET_NUMBER:
    addressHtml += record.STREET_NUMBER
    addressText += record.STREET_NUMBER
  if addressHtml != "":
    addressHtml += "<br/>"

  if record.CITY:
    addressHtml += record.CITY
    addressText += ", "+record.CITY
    if record.POSTAL_CODE:
      addressHtml += ", " + record.POSTAL_CODE
      addressText += ", " + record.POSTAL_CODE
  if addressHtml != "":
    addressHtml = "<table><tr><td valign='top'><strong>Address:</strong></td><td valign='top'> "+addressHtml+"</td></tr></table>"

  phoneNumber = ""
  if record.PHONE_NUMBER:
    phoneNumber = "<strong>Phone:</strong> "+formatPhone(record.PHONE_NUMBER) + "<br/>"
  emailAddress = ""
  if record.EMAIL_ADDRESS:
     emailAddress = "<strong>Email:</strong> <a href='mailto:"+record.EMAIL_ADDRESS+"'>"+record.EMAIL_ADDRESS + "</a><br/>"
  website = ""
  if record.WEBSITE:
    website = "<strong>Website:</strong> <a href='"+record.WEBSITE+"'>"+record.WEBSITE+"</a>"

  #---------------- response ----------------

  return """<Placemark id="97664">
    <name>"""+record.RG_NAME+"""</name>
    <snippet>"""+record.SV_NAME+"""</snippet>
    <visibility>false</visibility>
    <address>"""+addressText+"""</address>
    <description>
      <![CDATA[
      <div width="300px">


      <span style='font-size:1.5em; font-weight: bold;'>"""+record.RG_NAME+"""</span><br/>
      """+record.SV_NAME+"""<br/><br/>
      <strong>Service Area</strong>: """+record.formatTaxonomyName()+"""<br/><br/>
      <strong>Topics</strong>: """+record.formatGpceTaxonomyClassification()+"""<br/><br/>
      <p>"""+record.SV_DESCRIPTION+"""</p><br/>    
      """+addressHtml+"""
      """+hours+"""
      """+wheelchairAccessible+"""
      """+languages+"""
      """+phoneNumber+"""
      """+emailAddress+"""
      """+website+"""

 
      </div>
      ]]>
    </description>
    <styleUrl>#"""+styleName+"""</styleUrl>
    
    <ExtendedData>
    MHSU_GUID
      <Data name="MHSU_GUID">
        <displayName>MHSU_GUID</displayName>
        <value>"""+record.MHSU_GUID+"""</value>
      </Data>
      <Data name="SV_NAME">
        <displayName>SV_NAME</displayName>
        <value>"""+record.SV_NAME+"""</value>
      </Data>
      <Data name="RG_NAME">
        <displayName>RG_NAME</displayName>
        <value>"""+record.RG_NAME+"""</value>
      </Data>
      <Data name="CITY">
        <displayName>City</displayName>
        <value>"""+record.CITY+"""</value>
      </Data>
      <Data name="TAXONOMY_NAME">
        <displayName>Service Area</displayName>
        <value>"""+record.formatTaxonomyName()+"""</value>
      </Data>
      <Data name="SV_DESCRIPTION">
        <displayName>SV_DESCRIPTION</displayName>
        <value>"""+record.SV_DESCRIPTION+"""</value>
      </Data>
      <Data name="ALL_TEXT">
        <displayName>Keyword search</displayName>
        <value>"""+record.KEYWORD_SEARCH_TEXT+"""</value>
      </Data>
      <Data name="STUDENTS">
        <displayName>Students</displayName>
        <value>"""+record.STUDENT+"""</value>
      </Data>
      <Data name="AUDIENCES">
        <displayName>Audiences</displayName>
        <value>"""+record.formatAudience()+"""</value>
      </Data>
      <Data name="WHEELCHAIR_ACCESSIBLE">
        <displayName>Wheelchair Accessible</displayName>
        <value>"""+record.WHEELCHAIR_ACCESSIBLE+"""</value>
      </Data>
    </ExtendedData>
    <Point>
      <coordinates>"""+str(record.LONGITUDE)+""","""+str(record.LATITUDE)+"""</coordinates>
    </Point>
  </Placemark>

  """


#------------------------------------------------------------------------------
# Main
#------------------------------------------------------------------------------

argParser = argparse.ArgumentParser(description='Prepares data for the mental health web map')
argParser.add_argument('-s', dest='srcFilename', action='store', default=None, required=True, help='the source csv filename')
argParser.add_argument('-d', dest='destFilename', action='store', default=None, required=True, help='the destination kml filename')

try:
  args = argParser.parse_args()
except argparse.ArgumentError as e:
  argParser.print_help()
  sys.exit(1)

srcFile = open(args.srcFilename, "r");
destFile = open(args.destFilename, "w");


outputFormat = None
if args.destFilename.endswith(".kml"):
  outputFormat = "kml"
else:
  print "Unknown output format.  expecting destination filename to be of these types: [kml]"
  sys.exit(1)

# write header to output
# ----------------------------------------------------------------------------

header = getHeader()
destFile.write(header)


# read the data into a list
# ----------------------------------------------------------------------------

allRecords = []

csvReader = csv.reader(srcFile)
lineNum = 0
for csvRow in csvReader:
  lineNum += 1
  
  #two header rows
  if lineNum <= NUM_HEADER_ROWS:
    continue

  rec = csvRowToRecord(csvRow)
  allRecords.append(rec)
  
  
# write the data to the output
# ----------------------------------------------------------------------------

numSkippedNoLocation = 0
numSkippedInvalidLocation = 0
numWritten = 0
for rec in allRecords:
  placemark = getRow(rec)
  if not rec.hasLocation():
    numSkippedNoLocation += 1
    continue
  if not rec.isLocationValid():
    print "invalid location (lat="+(rec.LATITUDE)+", lon="+rec.LONGITUDE+"). skipping record with MHSU_GUID="+rec.MHSU_GUID
    numSkippedInvalidLocation += 1
    continue
  if placemark:
    destFile.write(placemark)
    numWritten += 1

# write footer to output
# ----------------------------------------------------------------------------

footer = getFooter()
destFile.write(footer)


# Cleanup
#------------------------------------------------------------------------------

srcFile.close();
destFile.close();

print "summary:"
print " # written: "+str(numWritten)
print " # skipped: "+str(numSkippedNoLocation+numSkippedInvalidLocation)
print "   - no location: "+str(numSkippedNoLocation)
print "   - invalid lat/lon: "+str(numSkippedInvalidLocation)