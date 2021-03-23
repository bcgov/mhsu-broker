import os
from sys import argv

'''

  Convert a file rom windows-1252 encoding to utf-8

'''

def usage():
   print """

Usage: 

  $ python %s  some_filename.csv

This results in some_filename.utf-8.csv
The new file is in utf-8 encoding.
""" % os.path.basename(__file__)


try:
   script, csv_file = argv
except:
   usage()
   exit(0);
   
csv_file_root, ext  = os.path.splitext(csv_file)
encoded_ext = '.utf-8%s' % ext

with open( csv_file, 'r') as infile:
    with open( csv_file_root + encoded_ext, 'w') as outfile:
        for line in infile:
            outfile.write(line.decode('windows-1252').encode('utf-8'))
