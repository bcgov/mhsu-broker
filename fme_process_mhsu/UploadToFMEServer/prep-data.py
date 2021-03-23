# Purpose: transforms the source .csv file into a new format .csv.
#          some of the transformation steps are:
#           - consolidate the ~7 taxonomy columns into a single colume
#           - consolidate the ~2 audience columns (adults, children and youth) into a single column
#           - generate some new fields, including the MHSU_GUID
#           - rollup (i.e. group together) records that have the same MHSU_GUID
#
# Inputs:
#  - the raw health link data in a standardized CSV format
#  - a CSV file of the taxonomy mapping matrix
#
# Output:
#  - a new CSV file containing the transformed records
#
# Usage:
#   python prep-data.py -s <source csv filename> -m <taxonomy matrix csv filename> -d <output csv filename>
#
# Usage Example:
#   python prep-data.py -s raw-healthlink-src.csv -m taxonomy-mapping.csv -d mental-health.csv
#

import csv
import cgi
import argparse
import re
import uuid

#------------------------------------------------------------------------------
# Constants
#------------------------------------------------------------------------------

NUM_HEADER_ROWS = 2;
COMPOUND_FIELD_DELIMETER = "|";

#------------------------------------------------------------------------------
# Globals
#------------------------------------------------------------------------------

taxonomyItems = {}

#------------------------------------------------------------------------------
# Classes
#------------------------------------------------------------------------------

class TaxonomyItem:
  def __init__(self):

    self.SV_TAXONOMY = None
    self.V_TAXONOMY_TERM = None
    self.SV_TAXONOMY_DESCRIPTION = None
    self.ALCOHOL_ADDICTIONS_AND_OTHER_SUBSTANCES = None
    self.BC_GOV_INFORMATION = None
    self.BODY_IMAGE_AND_EATING = None
    self.EDUCATION_AND_AWARENESS = None
    self.MOOD_AND_ANXIETY = None
    self.PSYCHOSIS_AND_THOUGHT_DISORDERS  = None
    self.SUICIDE_AND_SELF_HARM = None
    self.TRAUMA_AND_ABUSE = None
    self.ADULTS = None
    self.CHILDREN_AND_YOUTH = None
    self.STUDENTS = None

class TargetRecord:
  def __init__(self):

    self.MHSU_GUID = None
    self.GPCE_TAXONOMY_CLASSIFICATION = []
    self.AUDIENCE = []
    self.STUDENTS = None
    self.TAXONOMY_NAME = []
    self.RG_REFERENCE = None
    self.RG_NAME = None
    self.SV_REFERENCE = None
    self.SV_NAME = None
    self.SV_DESCRIPTION = None
    self.SL_REFERENCE = None
    self.LC_REFERENCE = None
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

  def getKeywordSearchText(self):
    return self.formatTaxonomyName(" ") +" "+ self.RG_NAME +" "+ self.SV_NAME +" "+ self.SV_DESCRIPTION +" "+ self.formatGpceTaxonomyClassification(" ") + " " +self.formatAudience(" ")

  def getMhsuSpecificTermsEnhancedSearch(self):
    return "mentalHealth3";

  def formatWheelchairAccessible(self):
    result = "No"
    if self.WHEELCHAIR_ACCESSIBLE in ["Y", "Yes"]:
      result = "Yes"
    return result

  def formatGpceTaxonomyClassification(self, delimeter):
    s = delimeter.join(self.GPCE_TAXONOMY_CLASSIFICATION)
    return s

  def formatTaxonomyName(self, delimeter):
    s = delimeter.join(self.TAXONOMY_NAME)
    return s

  def formatAudience(self, delimeter):
    s = delimeter.join(self.AUDIENCE)
    return s

  def toCsv(self):
    return "\""+str(self.MHSU_GUID)+"\",\""+str(self.formatGpceTaxonomyClassification(COMPOUND_FIELD_DELIMETER))+"\",\""+str(self.formatAudience(COMPOUND_FIELD_DELIMETER))+"\",\""+str(self.STUDENTS)+"\",\""+str(self.formatTaxonomyName(COMPOUND_FIELD_DELIMETER))+"\",\""+str(self.RG_NAME)+"\",\""+str(self.SV_NAME)+"\",\""+str(self.SV_DESCRIPTION)+"\",\""+formatPhone(self.PHONE_NUMBER)+"\",\""+formatUrl(self.WEBSITE)+"\",\""+str(self.EMAIL_ADDRESS)+"\",\""+str(self.formatWheelchairAccessible())+"\",\""+str(self.LANGUAGE)+"\",\""+str(self.HOURS)+"\",\""+str(self.STREET_NUMBER)+"\",\""+str(self.CITY)+"\",\""+str(self.PROVINCE)+"\",\""+str(self.POSTAL_CODE)+"\",\""+str(self.LATITUDE)+"\",\""+str(self.LONGITUDE)+"\",\""+str(self.getMhsuSpecificTermsEnhancedSearch())+"\",\""+str(self.getKeywordSearchText())+"\"\n"

class SourceRecord:
  def __init__(self):

    self.SV_TAXONOMY = None
    self.TAXONOMY_NAME = None
    self.RG_REFERENCE = None
    self.RG_NAME = None
    self.SV_REFERENCE = None
    self.SV_NAME = None
    self.SV_DESCRIPTION = None
    self.SL_REFERENCE = None
    self.LC_REFERENCE = None
    self.PHONE_NUMBER = None
    self.WEBSITE = None
    self.EMAIL_ADDRESS = None
    self.WHEELCHAIR_ACCESSIBLE = None
    self.LANGUAGE = None
    self.HOURS = None
    self.STREET_NUMBER = None
    self.STREET_NAME = None
    self.STREET_TYPE = None
    self.STREET_DIRECTION = None
    self.CITY = None
    self.PROVINCE = None
    self.POSTAL_CODE = None
    self.LATITUDE = None
    self.LONGITUDE = None
    self.LINK_811 = None

  def toCsv(self):
    return "\""+str(self.SV_TAXONOMY)+"\",\""+str(self.TAXONOMY_NAME)+"\",\""+str(self.RG_REFERENCE)+"\",\""+str(self.RG_NAME)+"\",\""+str(self.SV_REFERENCE)+"\",\""+str(self.SV_NAME)+"\",\""+formatPhone(self.SV_DESCRIPTION)+"\",\""+str(self.SL_REFERENCE)+"\",\""+str(self.LC_REFERENCE)+"\",\""+str(self.PHONE_NUMBER)+"\",\""+str(self.WEBSITE)+"\",\""+str(self.EMAIL_ADDRESS)+"\",\""+str(self.WHEELCHAIR_ACCESSIBLE)+"\",\""+str(self.LANGUAGE)+"\",\""+str(self.HOURS)+"\",\""+str(self.STREET_NUMBER)+"\",\""+str(self.STREET_NAME)+"\",\""+str(self.STREET_TYPE)+"\",\""+str(self.STREET_DIRECTION)+"\",\""+str(self.CITY)+"\",\""+str(self.PROVINCE)+"\",\""+str(self.POSTAL_CODE)+"\",\""+str(self.LATITUDE)+"\",\""+str(self.LONGITUDE)+"\",\""+str(self.LINK_811)+"\""

  #derived fields

  def getAudience(self):
    if self.SV_TAXONOMY not in taxonomyItems:
      raise Exception("SV_TAXONOMY '"+self.SV_TAXONOMY+"' not mapped")
    taxonomyItem = taxonomyItems[self.SV_TAXONOMY]

    result = []
    if taxonomyItem.ADULTS:
      result.append("Adults")
    if taxonomyItem.CHILDREN_AND_YOUTH:
      result.append("Children and Youth")
    if taxonomyItem.STUDENTS:
      result.append("Students")
    return result

  def getMhsuGuid(self):
    result = self.RG_REFERENCE + self.SV_REFERENCE + self.SL_REFERENCE
    return result

  def getStudents(self):
    if self.SV_TAXONOMY not in taxonomyItems:
      raise Exception("SV_TAXONOMY '"+self.SV_TAXONOMY+"' not mapped")

    taxonomyItem = taxonomyItems[self.SV_TAXONOMY]

    result = None
    if taxonomyItem.STUDENTS:
      return "Yes"

  def getGpceTaxonomyClassification(self):
    if self.SV_TAXONOMY not in taxonomyItems:
      raise Exception("SV_TAXONOMY '"+self.SV_TAXONOMY+"' not mapped")
    taxonomyItem = taxonomyItems[self.SV_TAXONOMY]
    items = []
    if taxonomyItem.ALCOHOL_ADDICTIONS_AND_OTHER_SUBSTANCES:
      items.append("Alcohol Addictions and Other Substances")
    if taxonomyItem.BC_GOV_INFORMATION:
      items.append("BC Gov Information")
    if taxonomyItem.BODY_IMAGE_AND_EATING:
      items.append("Body Image and Eating")
    if taxonomyItem.EDUCATION_AND_AWARENESS:
      items.append("Education and Awareness")
    if taxonomyItem.MOOD_AND_ANXIETY:
      items.append("Mood and Anxiety")
    if taxonomyItem.PSYCHOSIS_AND_THOUGHT_DISORDERS:
      items.append("Psychosis and Thought Disorders")
    if taxonomyItem.SUICIDE_AND_SELF_HARM:
      items.append("Suicide and Self Harm")
    if taxonomyItem.TRAUMA_AND_ABUSE:
      items.append("Trauma and Abuse")
    result = items
    return result



#------------------------------------------------------------------------------
# Functions
#------------------------------------------------------------------------------

def clean(s):
  result = s.strip()
  result = cgi.escape(result)
  return result

def formatPhone(s):
  formatted = s
  if len(s) == 10:
    formatted = "("+s[0:3]+") "+s[3:6]+"-"+s[6:]
  return formatted

def formatUrl(s):
  u = s.upper().strip();
  if u == "":
    return u

  formatted = s
  if not u.startswith("HTTP://") and not u.startswith("HTTPS://"):
    formatted = "http://"+s.strip()

  return formatted

#returns a single rolled up record
def rollUp(sourceRecords):

  firstRecord = sourceRecords[0]

  #initialize non-rolled-up fields
  trgRecord = TargetRecord()
  trgRecord.MHSU_GUID = uuid.uuid1()
  #trgRecord.GPCE_TAXONOMY_CLASSIFICATION = None
  #trgRecord.AUDIENCE = None
  #trgRecord.STUDENTS = None
  #trgRecord.TAXONOMY_NAME = None
  trgRecord.RG_REFERENCE = firstRecord.RG_REFERENCE
  trgRecord.RG_NAME = firstRecord.RG_NAME
  trgRecord.SV_REFERENCE = firstRecord.SV_REFERENCE
  trgRecord.SV_NAME = firstRecord.SV_NAME
  trgRecord.SV_DESCRIPTION = firstRecord.SV_DESCRIPTION
  trgRecord.SL_REFERENCE = firstRecord.SL_REFERENCE
  trgRecord.LC_REFERENCE = firstRecord.LC_REFERENCE
  trgRecord.PHONE_NUMBER = firstRecord.PHONE_NUMBER
  trgRecord.WEBSITE = firstRecord.WEBSITE
  trgRecord.EMAIL_ADDRESS = firstRecord.EMAIL_ADDRESS
  trgRecord.WHEELCHAIR_ACCESSIBLE = firstRecord.WHEELCHAIR_ACCESSIBLE
  trgRecord.LANGUAGE = firstRecord.LANGUAGE
  trgRecord.HOURS = firstRecord.HOURS
  trgRecord.STREET_NUMBER = firstRecord.STREET_NUMBER
  trgRecord.CITY = firstRecord.CITY
  trgRecord.PROVINCE = firstRecord.PROVINCE
  trgRecord.POSTAL_CODE = firstRecord.POSTAL_CODE
  trgRecord.LATITUDE = firstRecord.LATITUDE
  trgRecord.LONGITUDE = firstRecord.LONGITUDE

  gpceTaxonomies = []
  taxonomyNames = []
  audiences = []
  students = "No"
  for srcRec in sourceRecords:
    gpceTaxonomies.extend(srcRec.getGpceTaxonomyClassification())
    taxonomyNames.append(srcRec.TAXONOMY_NAME)
    if srcRec.getAudience():
      audiences.extend(srcRec.getAudience())
    if srcRec.getStudents() == "Yes":
      students = "Yes"

  #set rolled up fields
  gpceTaxonomies = list(set(gpceTaxonomies)) #unique items only
  trgRecord.GPCE_TAXONOMY_CLASSIFICATION = gpceTaxonomies

  taxonomyNames = list(set(taxonomyNames)) #unique items only
  trgRecord.TAXONOMY_NAME = taxonomyNames

  audiences = list(set(audiences)) #unique items only
  trgRecord.AUDIENCE = audiences

  trgRecord.STUDENTS = students

  return trgRecord

def getHeader():
  return "MHSU_GUID,GPCE_TAXONOMY_CLASSIFICATION,AUDIENCE,STUDENTS,TAXONOMY_NAME,RG_NAME,SV_NAME,SV_DESCRIPTION,PHONE_NUMBER,WEBSITE,EMAIL_ADDRESS,WHEELCHAIR_ACCESSIBLE,LANGUAGE,HOURS,STREET_NUMBER,CITY,PROVINCE,POSTAL_CODE,LATITUDE,LONGITUDE,MHSU_SPECIFIC_TERMS_ENHANCED_SEARCH,KEYWORD_SEARCH_TEXT\n"

def getFooter():
  return ""

def getRow(targetRecord):
  return targetRecord.toCsv()


def filter_non_ascii(source_string):
    r1 = re.compile('\xc3\xa1')  # u'\xe1'
    r2 = re.compile('\x91|\x92')  # windows-1251 left and right single quote
    source_string = r1.sub(' ', source_string)
    source_string = r2.sub("'", source_string)
    return source_string


def iso8859_csv_reader(raw_data, filter=filter_non_ascii, dialect=csv.excel, **kwargs):
    csv_reader = csv.reader(raw_data, dialect=dialect, **kwargs)
    for row in csv_reader:
        yield [filter(cell.decode('iso-8859-1').encode('latin1')) for cell in row]

#------------------------------------------------------------------------------
# Main
#------------------------------------------------------------------------------

argParser = argparse.ArgumentParser(description='Prepares data for the mental health web map')
argParser.add_argument('-s', dest='srcFilename', action='store', default=None, required=True, help='the source csv filename')
argParser.add_argument('-m', dest='mapFilename', action='store', default=None, required=True, help='the taxonomy mapping csv filename')
argParser.add_argument('-d', dest='destFilename', action='store', default=None, required=True, help='the destination csv filename')

try:
  args = argParser.parse_args()
except argparse.ArgumentError as e:
  argParser.print_help()
  sys.exit(1)

srcFile = open(args.srcFilename, "r");
mapFile = open(args.mapFilename, "r");
destFile = open(args.destFilename, "w");


outputFormat = None
if args.destFilename.endswith(".csv"):
  outputFormat = "csv"
else:
  print "Unknown output format.  expecting destination filename to be of these types: [csv]"
  sys.exit(1)

# write header to output
# ----------------------------------------------------------------------------

header = getHeader()
destFile.write(header)

# read the taxonomy mapping into a dict
# ----------------------------------------------------------------------------

mapReader = iso8859_csv_reader(mapFile)
lineNum = 0
for mapRow in mapReader:
  lineNum += 1

  #one header rows
  if lineNum <= 1:
    continue

  taxonomyItem = TaxonomyItem()

  taxonomyItem.SV_TAXONOMY = clean(mapRow[0])
  taxonomyItem.V_TAXONOMY_TERM = clean(mapRow[1])
  taxonomyItem.SV_TAXONOMY_DESCRIPTION = clean(mapRow[2])
  taxonomyItem.ALCOHOL_ADDICTIONS_AND_OTHER_SUBSTANCES = clean(mapRow[3])
  taxonomyItem.BC_GOV_INFORMATION = clean(mapRow[4])
  taxonomyItem.BODY_IMAGE_AND_EATING = clean(mapRow[5])
  taxonomyItem.EDUCATION_AND_AWARENESS = clean(mapRow[6])
  taxonomyItem.MOOD_AND_ANXIETY = clean(mapRow[7])
  taxonomyItem.PSYCHOSIS_AND_THOUGHT_DISORDERS  = clean(mapRow[8])
  taxonomyItem.SUICIDE_AND_SELF_HARM = clean(mapRow[9])
  taxonomyItem.TRAUMA_AND_ABUSE = clean(mapRow[10])
  taxonomyItem.ADULTS = clean(mapRow[11])
  taxonomyItem.CHILDREN_AND_YOUTH = clean(mapRow[12])
  taxonomyItem.STUDENTS = clean(mapRow[13])

  taxonomyItems[taxonomyItem.SV_TAXONOMY] = taxonomyItem

print "Taxonomy Map has "+str(len(taxonomyItems))+" items"

# read the data into a list
# ----------------------------------------------------------------------------

groupedRecords = {}

print "Reading source records..."
numSrcSkipped = 0
numSrcProcessed = 0
csvReader = iso8859_csv_reader(srcFile)
lineNum = 0
for csvRow in csvReader:
  lineNum += 1

  #two header rows
  if lineNum <= NUM_HEADER_ROWS:
    continue

  rec = SourceRecord()

  rec.SV_TAXONOMY = clean(csvRow[0])
  rec.TAXONOMY_NAME = clean(csvRow[1])
  rec.RG_REFERENCE = clean(csvRow[2])
  rec.RG_NAME = clean(csvRow[3])
  rec.SV_REFERENCE = clean(csvRow[4])
  rec.SV_NAME = clean(csvRow[5])
  rec.SV_DESCRIPTION = clean(csvRow[6])
  rec.SL_REFERENCE  = clean(csvRow[7])
  rec.LC_REFERENCE  = clean(csvRow[8])
  rec.PHONE_NUMBER = clean(csvRow[9])
  rec.WEBSITE = clean(csvRow[10])
  rec.EMAIL_ADDRESS = clean(csvRow[11])
  rec.WHEELCHAIR_ACCESSIBLE = clean(csvRow[12])
  rec.LANGUAGE  = clean(csvRow[13])
  rec.HOURS = clean(csvRow[14])
  rec.STREET_NUMBER = clean(csvRow[15])
  rec.STREET_NAME = clean(csvRow[16])
  rec.STREET_TYPE = clean(csvRow[17])
  rec.STREET_DIRECTION = clean(csvRow[18])
  rec.CITY = clean(csvRow[19])
  rec.PROVINCE = clean(csvRow[20])
  rec.POSTAL_CODE = clean(csvRow[21])
  rec.LATITUDE = clean(csvRow[22])
  rec.LONGITUDE = clean(csvRow[23])
  rec.LINK_811 = clean(csvRow[24])

  try:
    rec.getGpceTaxonomyClassification()
  except Exception as e:
    numSrcSkipped += 1
    print " skipping record. "+str(e)
    continue

  #group by MHSU_GUID
  if rec.getMhsuGuid() not in groupedRecords:
    groupedRecords[rec.getMhsuGuid()] = []
  groupedRecords[rec.getMhsuGuid()].append(rec)
  numSrcProcessed += 1


# write the data to the output
# ----------------------------------------------------------------------------

print "Transforming records into target format..."

numTargetWritten = 0
numTargetSkipped = 0
for mhsuGuid in groupedRecords:

  recordsInGroup = groupedRecords[mhsuGuid]
  print " rolling up "+str(len(recordsInGroup))+" record(s) with MHSU_GUID '"+mhsuGuid+"'"
  try:
    rolledUpRecord = rollUp(recordsInGroup)
    placemark = getRow(rolledUpRecord)
    if placemark:
      destFile.write(placemark)
    numTargetWritten += 1
  except Exception as e:
    print " skipping group with mhsuGuid='"+mhsuGuid+"'. "+str(e)
    numTargetSkipped += 1

# write footer to output
# ----------------------------------------------------------------------------

footer = getFooter()
destFile.write(footer)


# Cleanup
#------------------------------------------------------------------------------

srcFile.close();
destFile.close();

print "Summary:"
print " Source records"
print "  # skipped: "+str(numSrcSkipped)
print "  # processed: "+str(numSrcProcessed)
print " Rolled up records"
print "  # skipped: "+str(numTargetSkipped)
print "  # written: "+str(numTargetWritten)+"   <-- this is the total number of records written to the output file"