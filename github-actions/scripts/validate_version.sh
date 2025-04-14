echo >&2 "Version from main branch : $1"
echo >&2 "Version from incoming branch : $2"
retval=""
if [ "$1" \< "$2" ]; then
  retval="true"
else
  retval="false"
fi
echo $retval
