
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.kofc.lib.Constants;
import com.kofc.lib.tools;

public class ReplaceHref {

	public static void main(String[] args) {
		String str = "<p>ChurchLoan href is not<a title=\"test\" href=\"/en/test.html\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"kc_secure\"> intended</a>"
				+ " for, will not be approved for, and cannot be used otherwise for or funded in connection with (i) funding, "
				+ "defending or settling litigation href claims against a prospective Borrower or Guarantor, (ii) the bankruptcy or insolvency of any Borrower or "
				+ "Guarantor, or (iii) any non-project or non-operations purposes. ChurchLoan will consider loans to qualified Borrowers (i) only in the U.S., "
				+ "U.S. Territories and <a title=\"test\" href=\"/en/test.html\" class=\"kc_secure\" target=\"_blank\" rel=\"noopener noreferrer\">Canada</a>, "
				+ "and (ii) (if a secured loan request) only secured by real property in the U.S., U.S. Territories and Canada. "
				+ "<a  class=\"kc_secure\" title=\"test\" href=\"/en/test.html\" target=\"_blank\" rel=\"noopener noreferrer\">ChurchLoan</a> reserves the right to take no action on any loan request.</p>";
		System.out.println("actual string 1--->" + str);

		// str = tools.addKCSecure(str);
		// System.out.println(str);

		System.out.println(tools.addKCSecure(removeFqdnHref(str, "kofc.org")));

		str = "<table style=\"height: 182px; margin-left: auto; margin-right: auto;\" width=\"100%\">\r\n"
				+ "<tbody>\r\n" + "<tr>\r\n"
				+ "<td style=\"width: 260px; text-align: center;\"><img src=\"http://www.kofc.org/assets/images/brand/forth-degree.jpg\" alt=\"KofC 4th degree Emblem\" width=\"137\" height=\"182\" /></td>\r\n"
				+ "<td style=\"width: 261px; text-align: center;\"><img src=\"/assets/images/brand/mcgivney-emblem.jpg\" alt=\"KofC McGivney Emblem\" width=\"137\" height=\"182\" /></td>\r\n"
				+ "</tr>\r\n" + "<tr>\r\n"
				+ "<td style=\"width: 260px; text-align: center;\"><a href=\"http://www.kofc.org/assets/images/brand/KofC-4thdegree-clr.zip\" target=\"_blank\" rel=\"noopener noreferrer\">DOWNLOAD</a><br />includes .png &amp; .eps</td>\r\n"
				+ "<td style=\"width: 261px; text-align: center;\"><a href=\"http://www.kofc.org/assets/images/brand/KofC-mcgivney-emblem.zip\">DOWNLOAD</a><br />includes .png &amp; .eps</td>\r\n"
				+ "</tr>\r\n" + "</tbody>\r\n" + "</table>\r\n"
				+ "<p><strong><br /><br /></strong>Questions regarding the intellectual property policies of Knights of Columbus should be directed to the Name and Emblem Committee at <a href=\"mailto:nameandembleminquiries@kofc.org\">nameandembleminquiries@kofc.org</a>.</p>\r\n"
				+ "<p>Questions regarding public relations and brand standards should be directed to the Communications Department at <a href=\"mailto:communications@kofc.org\">communications@kofc.org</a>.</p>\r\n"
				+ "<p>Questions regarding licensing of the intellectual property of the Knights of Columbus by vendors should be directed to the Knights of Columbus Procurement Department at "
				+ "<a href=\"mailto:procurement@kofc.org\">procurement@kofc.org</a>.<br /><br /><br /></p>";

		// str ="<td style=\"width: 261px; text-align: center;\"><a
		// href=\"http://www.kofc.org/assets/images/brand/KofC-mcgivney-emblem.zip\">DOWNLOAD</a><br
		// />includes .png &amp; .eps</td>\r\n" ;

		str = "<tbody>\r\n" + "<tr>\r\n"
				+ "<td style=\"width: 260px; text-align: center;\"><img src=\"/assets/images/brand/forth-degree.jpg\" alt=\"KofC 4th degree Emblem\" width=\"137\" height=\"182\" /></td>\r\n"
				+ "<td style=\"width: 261px; text-align: center;\"><img src=\"/assets/images/brand/mcgivney-emblem.jpg\" alt=\"KofC McGivney Emblem\" width=\"137\" height=\"182\" /></td>\r\n"
				+ "</tr>\r\n" + "<tr>\r\n"
				+ "<td style=\"width: 260px; text-align: center;\"><a href=\"http://www.kofc.org/assets/images/brand/KofC-4thdegree-clr.zip\" target=\"_blank\" rel=\"noopener noreferrer\">DOWNLOAD</a><br />includes .png &amp; .eps</td>\r\n"
				+ "<td style=\"width: 261px; text-align: center;\"><a href=\"stage.kofc.org/assets/images/brand/KofC-mcgivney-emblem.zip\">DOWNLOAD</a><br />includes .png &amp; .eps</td>\r\n"
				+ "</tr>\r\n" + "</tbody>\r\n" + "</table>\r\n"
				+ "<p><strong><br /><br /></strong>Questions regarding the intellectual property policies of Knights of Columbus should be directed to the Name and Emblem Committee at <a href=\"mailto:nameandembleminquiries@kofc.org\">nameandembleminquiries@kofc.org</a>.</p>\r\n"
				+ "<p>Questions regarding public relations and brand standards should be directed to the Communications Department at <a href=\"mailto:communications@kofc.org\">communications@kofc.org</a>.</p>\r\n"
				+ "<p>Questions regarding licensing of the intellectual property of the Knights of Columbus by vendors should be directed to the Knights of Columbus Procurement Department at <a href=\"mailto:procurement@kofc.org\">procurement@kofc.org</a>.<br /><br /><br /></p>";

		str = "<p><a href=\"/en/members/resources/logos-emblems/logos.html\">Logos &amp; Emblems</a></p>\r\n"
				+ "<p><a href=\"https://slideshows.kofc.org/kofc/en/media-library.html\" target=\"_blank\" rel=\"noopener noreferrer\">Photo Library</a></p>\r\n"
				+ "<p><a href=\"//en/news/media.html\">Press Releases</a></p>\r\n"
				+ "<td style=\"width: 260px; text-align: center;\"><a href=\"http://www.kofc.org/assets/images/brand/KofC-4thdegree-clr.zip\" target=\"_blank\" rel=\"noopener noreferrer\">DOWNLOAD</a><br />includes .png &amp; .eps</td>\r\n"
				+ "<p><a href=\"/en/news/index.html\">Recent News</a></p>\r\n"
				+"<p>Questions regarding public relations and brand standards should be directed to the Communications Department at <a href=\"mailto:communications@kofc.org\">communications@kofc.org</a>.</p>\r\n"
				+ "<p><a href=\"/en/conv/2019/daily-convention-news/index.html\">Supreme Convention</a></p>\r\n"
				+"<p><a href=\"http://www.google.com/en/videos/index.html\">google Library</a></p>"
				+"<p><a href=\"http://www.google.com/en/videos/index.html\">google Library</a></p>"
				+"<a title=\"DOWNLOAD KofC LOGO\" href=\"/assets/images/brand/KofC-brand-assets.zip\" target=\"_blank\" rel=\"noopener noreferrer\">DOWNLOAD LOGO</a><br />Download includes .png &amp; .eps</p>"
				+ "<p><a href=\"http://www.kofc.org/en/videos/index.html\">Video Library</a></p>"
				+"Download includes .png &amp; .eps</p>\r\n" + 
				"<a href='/assets/images/brand/KofC-Emblem-assets.zip' "
				+"<p>When using the emblem of the Order or that of the Fourth Degree, the identifying information of the Subordinate Unit (name, number, and geographic location) should always be featured in close proximity to the emblem.<br /><br />This provides proper credit to the Subordinate Unit while distinguishing its activities from those of the Supreme Council and other Subordinate Units.<br /><br /><a title=&#34;DOWNLOAD&nbsp;KofC EMBLEM&#34; href='/assets/images/brand/KofC-Emblem-assets.zip' target='_blank' rel='noopener noreferrer'>DOWNLOAD&nbsp;EMBLEM</a><br />Download includes .png &amp; .eps</p>";

		
		str="<p>I'm the Doctor, I'm worse than everyone's aunt. *catches himself* <a href=\"/relative/path.html\">And</a> \n"
				+ "<a href=\"http://www.kofc.org/fully/qualified.html\">that</a>\n"
				+ "<a href=\"http://kofc.org/insecure/without.www\">is</a>\n"
				+ "<a href=\"/relative/with/www.kofc.org/in/mid/path.html\">not</a>\n "
				+ "<a href=\"#hash\">how</a> \n"
				+ "I'm <a href=\"https://www.google.com\">introducing</a>\n"
				+ "<a href=\"http://www.kofcassetadvisors.com/en/banana.html\">myself</a>.\n"
				+ "I'm nobody's <a href=\"?section=Truthyness\">taxi</a>\n"
				+ "<a href=\"//www.kofc.org/proto/relative/path.html\">service</a>;\n"
				+ "I'm <a href=\"//www.google.com/?woooo\">not</a> gonna be there to catch you every time you feel like jumping out of a spaceship.</p>\n"
				+ "<a href=\"mailto:communications@kofc.org\">communications@kofc.org</a>.\n"
				+ "<p><a href=\"https://slideshows.kofc.org/kofc/en/media-library.html\" target=\"_blank\" rel=\"noopener noreferrer\">Photo Library</a></p>\\n";
		
		System.out.println("Actual String 2-->" + str);
		System.out.println("==============================");
		// System.out.println("After-->"+removeFqdnHref(str,"kofc.org"));

		System.out.println("==Secure==");

		// System.out.println(tools.addKCSecure(tools.removeFqdnHref(tools.massageTextAreaContent(str),"kofc.org")));
		//System.out.println(
		//tools.removeFqdnHref(tools.massageTextAreaContent(str),"kofc.org"));
		System.out.println(tools.removeFqdnHref(str, "kofc.org"));

		//TestHrefRegex();

	}
	
	
	//   ^(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)  --img
	//   ^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)  -img
	/*
	 * http://www.kofc.org/assets/images/brand/KofC-mcgivney-emblem.zip
	 * //www.kofc.org/proto/relative/path.html" https://www.google.com
	 * http://www.kofcassetadvisors.com/en/index.html
	 * http://slideshows.kofc.org/en/asdfa.html
	 */
	private static String removeFqdnHref(String inputString, String fqdnString) {
		Pattern pattern = Pattern.compile("href=[\"']?((?:.(?![\"']?\\s+(?:\\S+)=|[>\"']))+.)[\"']?",
				Pattern.MULTILINE);
		Matcher matcher = pattern.matcher(inputString);
		StringBuffer sb = new StringBuffer();
		int counter=0;
		while (matcher.find()) {
			System.out.println("counter -->"+ ++counter);
			String matchString = matcher.group(1);
			/*
			 * if(matchString.contains(fqdnString)) {
			 * 
			 * if(!matchString.startsWith("mailto:")) { matcher.appendReplacement(sb,
			 * "href=\""+replaceFqdn(matchString,fqdnString)+"\""); //String
			 * patternStr="/(.*)"+fqdnString+"(.*)/"; //matcher.appendReplacement(sb,
			 * "href=\""+matchString.replace(patternStr, "$2")+"\""); }
			 * 
			 * 
			 * if(!(matchString.startsWith("mailto:")||matchString.startsWith("https:"))) {
			 * matcher.appendReplacement(sb,
			 * Constants.KC_SECURE+"=\""+replaceFqdn(matchString,fqdnString)+"\""); } }
			 */

			if(matchString.startsWith("/")) {
				if(matchString.charAt(1)=='/') 
				{
					if(getDomainName(matchString).equals(fqdnString)) {
						matcher.appendReplacement(sb,
								Constants.KC_SECURE+"=\""+replaceFqdn(matchString,fqdnString)+"\"");
					}
					//matchString = matchString.replaceFirst("/","");
					
				}else {
					System.out.println("-- "+matchString);
					matcher.appendReplacement(sb,
							Constants.KC_SECURE+"=\""+matchString+"\"");	  
				}
			}else {
				if(matchString.startsWith("mailto:")) {
					//do nothing
				}else if(matchString.startsWith("http") ||matchString.contains(fqdnString)) {
					System.out.println("domain-->"+getDomainName(matchString)+"<---->"+fqdnString);
					if(!getDomainName(matchString).equals(fqdnString)) {
						//do nothing
						System.out.println("not equal");
					}else {
						if(!matchString.contains("slideshows."+fqdnString)) {
							System.out.println("== "+matchString);
							matcher.appendReplacement(sb,
									Constants.KC_SECURE+"=\""+replaceFqdn(matchString,fqdnString)+"\"");	
						}	
					}
				}	
			}

		}
		matcher.appendTail(sb);
		return sb.toString();
	}

	private static String getDomainName(String inputString) {
		System.out.println("in getDomainName-->");
		Pattern pattern = Pattern.compile("^(?:https?:)?(?:\\/\\/)?(?:[^@\\n]+@)?(?:www\\.)?([^:\\/\\n]+)");
		Matcher matcher = pattern.matcher(inputString);
		/*
		 * while(matcher.find()) {
		 * System.out.println("--domain name-->"+matcher.group(1)); }
		 */
		return matcher.find() ? matcher.group(1) : inputString;
	}


	private static String replaceFqdn(String inputString, String findString) {
		// Pattern pattern = Pattern.compile(".*kofc.org(.*)");
		Pattern pattern = Pattern.compile(".*" + findString + "(.*)");
		Matcher matcher = pattern.matcher(inputString);
		return matcher.find() ? matcher.group(1) : inputString;
	}

	private static String addKCSecure(String str) {
		return str.replaceAll(Constants.HREF, Constants.KC_SECURE);
	}

	private static void TestHrefRegex() {

		final String regex = "href=[\\\"']?((?:.(?![\\\"']?\\\\s+(?:\\\\S+)=|[>\\\"']))+.)[\\\"']?";
		final String string = "<p><a href=\"/en/members/resources/logos-emblems/logos.html\">Logos &amp; Emblems</a></p>\n"
				+ "<p><a href=\"https://slideshows.kofc.org/kofc/en/media-library.html\" target=\"_blank\" rel=\"noopener noreferrer\">Photo Library</a></p>\n"
				+ "<p><a href=\"/en/news/media.html\">Press Releases</a></p>\n"
				+ "<p><a href=\"/en/news/index.html\">Recent News</a></p>\n"
				+ "<p><a href=\"/en/conv/2019/daily-convention-news/index.html\">Supreme Convention</a></p>\n"
				+ "<p><a href=\"http://www.kofc.org/en/videos/index.html\">Video Library</a></p>";

		final Pattern pattern = Pattern.compile(regex, Pattern.MULTILINE);
		final Matcher matcher = pattern.matcher(string);

		while (matcher.find()) {
			System.out.println("Full match: " + matcher.group(0));
			for (int i = 1; i <= matcher.groupCount(); i++) {
				System.out.println("Group " + i + ": " + matcher.group(i));
			}
		}

	}

}
