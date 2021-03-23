e:

cd /sw_nt/FMEServer/resources/data/MHSU/
IF /I "%ERRORLEVEL%" NEQ "0" (
      exit "%ERRORLEVEL%"
)
echo parameter 1: %1 >logfile.txt 2>errs.txt
echo parameter 2: %2 >>logfile.txt 2>>errs.txt
echo parameter 3: %3 >>logfile.txt 2>>errs.txt
echo parameter 4: %4 >>logfile.txt 2>>errs.txt
echo parameter 5: %5 >>logfile.txt 2>>errs.txt

echo python version >>logfile.txt 2>>errs.txt
%5\python -V >>logfile.txt 2>>errs.txt

echo calling win1252_2_utf8.py >>logfile.txt 2>>errs.txt
%5\python win1252_2_utf8.py %1 >>logfile.txt 2>>errs.txt
IF /I "%ERRORLEVEL%" NEQ "0" (
     exit "%ERRORLEVEL%"
)

echo calling prep-data.py >>logfile.txt 2>>errs.txt
%5\python prep-data.py -s %2 -m taxonomy-mapping.csv -d %3 >>logfile.txt 2>>errs.txt
IF /I "%ERRORLEVEL%" NEQ "0" (
     exit "%ERRORLEVEL%"
)

echo calling csv-to-kml.py >>logfile.txt 2>>errs.txt
%5\python csv-to-kml.py -s %3 -d %4 >>logfile.txt 2>>errs.txt
IF /I "%ERRORLEVEL%" NEQ "0" (
      exit "%ERRORLEVEL%"
)
exit 0
