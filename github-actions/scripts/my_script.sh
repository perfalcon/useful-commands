
echo >&2 "Version from main branch : $1"
echo >&2 "Version from incoming branch : $2"
retval=""
if [ "$1" \< "$2" ]; then
  retval="true"
else
  retval="false"
fi
#if [ "$retval" == "true" ] 
#then
#  echo $2
#else
#  echo $1
#fi
echo $retval
