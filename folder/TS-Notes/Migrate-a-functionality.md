To Migrate a script or a functionality to another machine:
1. Go to the script or the point where the functionality starts.
2. From there go through the script to see if it is calling/using anyother scripts or resources, basically finding the dependencies
3. once you find the dependencies in the first script from there we need to follow step (2) , like a recursive .
4. Migrate all the resources/ scripts , apply the necessary permissions as in the old system
5. Do a dry run/ test, then we will know any unknown dependencies/missing parts.
6. Add/fix those missing parts.
7. Test.
8. repeat from 2 to 7 until we get to the feel that it is working as expected.
