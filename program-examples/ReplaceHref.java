
import java.util.regex.Matcher;
import java.util.regex.Pattern;



public class ReplaceHref {

	public static void main(String[] args) {
		String str = "<p>ChurchLoan href is not<a title=\"test\" href=\"/en/test.html\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"kc_secure\"> intended</a>"
				+ " for, will not be approved for, and cannot be used otherwise for or funded in connection with (i) funding, "
				+ "defending or settling litigation href claims against a prospective Borrower or Guarantor, (ii) the bankruptcy or insolvency of any Borrower or "
				+ "Guarantor, or (iii) any non-project or non-operations purposes. ChurchLoan will consider loans to qualified Borrowers (i) only in the U.S., "
				+ "U.S. Territories and <a title=\"test\" href=\"/en/test.html\" class=\"kc_secure\" target=\"_blank\" rel=\"noopener noreferrer\">Canada</a>, "
				+ "and (ii) (if a secured loan request) only secured by real property in the U.S., U.S. Territories and Canada. "
				+ "<a  class=\"kc_secure\" title=\"test\" href=\"/en/test.html\" target=\"_blank\" rel=\"noopener noreferrer\">ChurchLoan</a> reserves the right to take no action on any loan request.</p>";
		System.out.println("actual string 1--->"+str);

		//str = tools.addKCSecure(str);
		//System.out.println(str);

		System.out.println(tools.addKCSecure(removeFqdnHref(str,"kofc.org")));		

		str= "<table style=\"height: 182px; margin-left: auto; margin-right: auto;\" width=\"100%\">\r\n" + 
				"<tbody>\r\n" + 
				"<tr>\r\n" + 
				"<td style=\"width: 260px; text-align: center;\"><img src=\"http://www.kofc.org/assets/images/brand/forth-degree.jpg\" alt=\"KofC 4th degree Emblem\" width=\"137\" height=\"182\" /></td>\r\n" + 
				"<td style=\"width: 261px; text-align: center;\"><img src=\"/assets/images/brand/mcgivney-emblem.jpg\" alt=\"KofC McGivney Emblem\" width=\"137\" height=\"182\" /></td>\r\n" + 
				"</tr>\r\n" + 
				"<tr>\r\n" + 
				"<td style=\"width: 260px; text-align: center;\"><a href=\"http://www.kofc.org/assets/images/brand/KofC-4thdegree-clr.zip\" target=\"_blank\" rel=\"noopener noreferrer\">DOWNLOAD</a><br />includes .png &amp; .eps</td>\r\n" + 
				"<td style=\"width: 261px; text-align: center;\"><a href=\"http://www.kofc.org/assets/images/brand/KofC-mcgivney-emblem.zip\">DOWNLOAD</a><br />includes .png &amp; .eps</td>\r\n" + 
				"</tr>\r\n" + 
				"</tbody>\r\n" + 
				"</table>\r\n" + 
				"<p><strong><br /><br /></strong>Questions regarding the intellectual property policies of Knights of Columbus should be directed to the Name and Emblem Committee at <a href=\"mailto:nameandembleminquiries@kofc.org\">nameandembleminquiries@kofc.org</a>.</p>\r\n" + 
				"<p>Questions regarding public relations and brand standards should be directed to the Communications Department at <a href=\"mailto:communications@kofc.org\">communications@kofc.org</a>.</p>\r\n" + 
				"<p>Questions regarding licensing of the intellectual property of the Knights of Columbus by vendors should be directed to the Knights of Columbus Procurement Department at "
				+ "<a href=\"mailto:procurement@kofc.org\">procurement@kofc.org</a>.<br /><br /><br /></p>";

		//str ="<td style=\"width: 261px; text-align: center;\"><a href=\"http://www.kofc.org/assets/images/brand/KofC-mcgivney-emblem.zip\">DOWNLOAD</a><br />includes .png &amp; .eps</td>\r\n" ;

		System.out.println("Actual String 2-->"+str);
		System.out.println("==============================");
		System.out.println("After-->"+removeFqdnHref(str,"kofc.org"));

		System.out.println("==Secure==");

	//	System.out.println(tools.addKCSecure(tools.removeFqdnHref(str,"kofc.org")));


	}

	private static String removeFqdnHref(String inputString, String fqdnString) {
		Pattern      pattern      = Pattern.compile("href=[\"']?((?:.(?![\"']?\\s+(?:\\S+)=|[>\"']))+.)[\"']?");
		Matcher      matcher      = pattern.matcher(inputString);
		StringBuffer sb = new StringBuffer();
		while(matcher.find()) {
			String matchString = matcher.group(1);
			if(matchString.contains(fqdnString)) {
				if(!matchString.startsWith("mailto:")) {
					matcher.appendReplacement(sb, "href=\""+replaceFqdn(matchString,fqdnString)+"\"");
					//String patternStr="/(.*)"+fqdnString+"(.*)/";
					//matcher.appendReplacement(sb, "href=\""+matchString.replace(patternStr, "$2")+"\"");
				}       		
			}        	        	
		}
		matcher.appendTail(sb);
		return sb.toString();
	}

	private static String replaceFqdn(String inputString, String findString) {
		//Pattern pattern = Pattern.compile(".*kofc.org(.*)"); 
		Pattern pattern = Pattern.compile(".*"+findString+"(.*)");
		Matcher matcher = pattern.matcher(inputString); 		
		return matcher.find()? matcher.group(1): inputString;
	}

	private static String addKCSecure(String str) {
		return str.replaceAll(Constants.HREF, Constants.KC_SECURE);		
	}




}
