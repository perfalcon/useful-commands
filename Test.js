//###################################################################
//# Name:
//# Author: Balaveera Thatikonda
//# Created: 8 Dec 2010
//# Comments:This javascript contains the formapi functions to be executed by Enr-Articles DCT
//# History:  

/* Begin Variable Declaration */
var waPath =IWDatacapture.getWorkarea();

var dctPath=IWDatacapture.getDCTPath();		
var dctPathArray=dctPath.split("/");

var formType=IWDatacapture.getFormType();		
var catg_datatype=formType.split('/');

var relPath="";
var gmapItem=""; //this will contain the current address item name, which initiated the gmap


var flag_featureheadline=0;//0:false, 1:true, for feature headline
var feature_rep_no="";


/* End of Variable Declarations */

IWEventRegistry.addFormHandler("onFormInit",init_K4XML);
//To Enable Image Preview in DCR's
IWDatacapture.enableImagePreview (true);


function init_K4XML()
{
  //  alert(IWDatacapture.getItem("/K4GenericXML/Media/tocheckedit").getValue());
	/* Begin Form Handlers */
	IWEventRegistry.addFormHandler("onSaveDone", generateXML);
	IWEventRegistry.addFormHandler("onClose", close_routine);
//	IWEventRegistry.addFormHandler("onSave", setDcrName);

	IWEventRegistry.addFormHandler("onSaveValid",validateDcr);
	IWEventRegistry.addFormHandler("OnPreview",onPreview);	
	/* End Form Handlers */

	/* Begin Item Handlers */
	IWEventRegistry.addItemHandler("/K4GenericXML/Media/media/mediaref","onCallout",importFromDesktop);
	IWEventRegistry.addItemHandler("/K4GenericXML/Target/pubname" , "onItemChange", onChangePubname);
	IWEventRegistry.addItemHandler("/K4GenericXML/Target/channel" , "onItemChange", onChangeChannel);
	IWEventRegistry.addItemHandler("/K4GenericXML/Target/subchannel1" , "onItemChange", onChangeSubChannel);
	IWEventRegistry.addItemHandler("/K4GenericXML/Target/edition" , "onItemChange", onChangeEdition);
	IWEventRegistry.addItemHandler("/K4GenericXML/Media/media/mediatype" , "onItemChange", onChangeMediaType);
	IWEventRegistry.addItemHandler("/K4GenericXML/Media/media" , "OnReplicantAdded", onRepAddDisableVideoID);
	//IWEventRegistry.addItemHandler("/K4GenericXML/Body/body" , "onItemChange", getWordCount);
	IWEventRegistry.addItemHandler("/K4GenericXML/Body/creatorgroup" , "OnReplicantAdded", onRepAddDisableCreatorText);
	IWEventRegistry.addItemHandler("/K4GenericXML/Body/coverdate","onCallout",onCoverDate);
	IWEventRegistry.addItemHandler("/K4GenericXML/Target/locationgroup/Address","onCallout",onCalloutAddress);
	IWEventRegistry.addItemHandler("/K4GenericXML/Target/destinations" , "OnReplicantAdded", onRepAddDestinations);
	IWEventRegistry.addItemHandler("/K4GenericXML/Target/destinations/site" , "onItemChange", onChangeSite);
	IWEventRegistry.addItemHandler("/K4GenericXML/Target/destinations/channel" , "onItemChange", onChangeDestChannel);
	IWEventRegistry.addItemHandler("/K4GenericXML/System MetaData/subscription/contenttype" , "onItemChange", onChangeContentType);
	IWEventRegistry.addItemHandler("/K4GenericXML/Media/media" , "OnReplicantAdded", onRepAddMedia);
	IWEventRegistry.addItemHandler("/K4GenericXML/Target/destinations/subchannel","onItemChange",validateDest);
	if(!isNew())
	{
		var body=IWDatacapture.getItem("/K4GenericXML/Body/body").getValue();
		var arr_values1 = new Array();
		arr_values1 = body.split ('</p>');
		var temp = arr_values1.length-1;		
		IWDatacapture.getItem("/K4GenericXML/Body/paragraphcount").setValue(temp.toString());

		//for word count

		 var text=IWDatacapture.getItem("/K4GenericXML/Body/body").getValue();                      
         text = text.replace(/<[^>]+>/g, '');			// Strip out all tags.			
    	 text = text.replace(new RegExp( "\\n", "g" ),"" ); 	// Strip out all line breaks.
		 text = text.replace(new RegExp( "\&#160;", "g" ),"" );	//	Strip out non breaking space character.	
		 text = text.replace(/\s/g,' ');
		var temp= text.split(' ').length;
		
	IWDatacapture.getItem("/K4GenericXML/Body/wordcount").setValue(temp.toString());
	
	var originItem= IWDatacapture.getItem("/K4GenericXML/System MetaData/origin")
		var NoOfOptions = originItem.getOptions()[originItem.getValue()].text;
		
		if(NoOfOptions == 100)
		{
			/*originItem.removeOption(0);
			
			newOptions = new Array();
			newOptions[0] = new Option("Select...", "0", false, false);
			newOptions[1] = new Option("Print", "100", false, true);
			newOptions[2] = new Option("Web", "101", false, false);
			originItem.setOptions(newOptions);*/
		}
		else if(NoOfOptions ==101)
		{
			/*originItem.removeOption(0);
			
			newOptions = new Array();
			newOptions[0] = new Option("Select...", "0", false, false);
			newOptions[1] = new Option("Print", "100", false, false);
			newOptions[2] = new Option("Web", "101", false, true);
			originItem.setOptions(newOptions); */
		}
		else
		{
			originItem.removeOption(0);
			
			newOptions = new Array();
			newOptions[0] = new Option("Select...", "0", false, true);
			newOptions[1] = new Option("Print", "100", false, false);
			newOptions[2] = new Option("Web", "101", false, false);
			originItem.setOptions(newOptions);
		}

	}


	IWEventRegistry.addItemHandler("/K4GenericXML/Body/body" , "onItemChange", getParagraphCount);


	/* End Item Handlers */

	/* Begin Listeners */
	//parent.IWDCEventRegistry.addListener('onItemAdded', handleReplicantAdd);
	/* End Listeners */

	
	/* Begin of Initial setup */
		setInitialValues();
	
	
	if(isNew())
	{
		 populate_sitesDB(null,null,"/K4GenericXML/Target/pubname");
	}
	else
	{
		setTeaserValue();		
		show_hide_video();
		var nextfun="onChangePubWrapper()";
		var iSite=IWDatacapture.getItem("/K4GenericXML/Target/pubname");
		var site=iSite.getOptions()[iSite.getValue()].value;
		var site_id=site.split(':')[0];
		populate_sitesDB(nextfun,site_id,'/K4GenericXML/Target/pubname');		
		
	}
    //alert("end");
	/* End of Initial setup */
}

function getParagraphCount(item)
{
	
	var text=item.getValue();
	var arr_values = new Array();
	arr_values = text.split ('</p>');
	var temp = arr_values.length-1;
	
	IWDatacapture.getItem("/K4GenericXML/Body/paragraphcount").setValue(temp.toString());
	getWordCount(IWDatacapture.getItem("/K4GenericXML/Body/body"));

}

function validateDest()
{
		
	var s_pubName=IWDatacapture.getItem("/K4GenericXML/Target/pubname");
	var val_pubName="";
   if(s_pubName.getValue() > 0 && s_pubName.getValue() != null)
		val_pubName=s_pubName.getOptions()[s_pubName.getValue()].text;	

	var s_channel=IWDatacapture.getItem("/K4GenericXML/Target/channel");	
	var val_channel = s_channel.getOptions()[s_channel.getValue()].text;	

	s_subchannel=IWDatacapture.getItem("/K4GenericXML/Target/subchannel1");
	var val_subchannel = s_subchannel.getOptions()[s_subchannel.getValue()].text;

	var det_rep=IWDatacapture.getItem("/K4GenericXML/Target/destinations").getChildren();	
	

	for(var i=0;i<det_rep.length;i++)
	{
		var j=i+1;
			var site_item=IWDatacapture.getItem("/K4GenericXML/Target/destinations["+j+"]/site");
			if(site_item !=''){		
				var site_value = site_item.getOptions()[site_item.getValue()].text;		
			}
					
			var channel_item=IWDatacapture.getItem("/K4GenericXML/Target/destinations["+j+"]/channel");
			if(channel_item !=''){			
			var channel_value = channel_item.getOptions()[channel_item.getValue()].text;		
			}

			var subchannel_item=IWDatacapture.getItem("/K4GenericXML/Target/destinations["+j+"]/subchannel");		
			if(subchannel_item !=''){	
			var subchannel_value = subchannel_item.getOptions()[subchannel_item.getValue()].text;		
			}

			if(val_pubName == site_value && val_subchannel == subchannel_value && val_channel == channel_value)
			{
				alert("Both Source and Destination cannot be same. Please choose different  subchannel in the destination");
				subchannel_item.setFocus();
				
				
			}
	}
	

}




function onPreview()
{
 //alert("preview start");
	var v_pubName=IWDatacapture.getItem("/K4GenericXML/Target/pubname").getValue();
	var v_channel=IWDatacapture.getItem("/K4GenericXML/Target/channel").getValue();
	//var v_subchannel=IWDatacapture.getItem("/K4GenericXML/Target/subchannel1").getValue();
	var s_pubName=IWDatacapture.getItem("/K4GenericXML/Target/pubname");


	var val_pubName="";
   if(s_pubName.getValue() > 0 && s_pubName.getValue() != null)
		val_pubName=s_pubName.getOptions()[s_pubName.getValue()].text;


	if(v_pubName=="")
	{
		alert("Please fill the target tab, before preview");
		s_pubName.setFocus();
		return false;
		
	}

	 //alert("preview end");
	setPreviewTPL();
	return true;
}

function getPhotoCount()
{
	var photoct=0;
	var medias= IWDatacapture.getItem("/K4GenericXML/Media/media").getChildren();
	for(i=0;i<medias.length;i++)
	{
	  j=i+1;
	 var mediatype=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/mediatype");
	 var type_val=mediatype.getOptions()[mediatype.getValue()].value;
	 if(type_val=="photograph" || type_val=="chart" || type_val=="graph" || type_val=="map")
		{		
			photoct++;
		}
	}
	//alert("photo count:"+photoct);
	return photoct;
}

function onChangechannel_att(item)
{
	alert("please select the feature head line");
	var reps= IWDatacapture.getItem("/K4GenericXML/Media/media").getChildren();
	var medias= IWDatacapture.getItem("/K4GenericXML/Media/media").getChildren();
	for(i=0;i<medias.length;i++)
	{
	  j=i+1;
	 var mediatype=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/mediatype");
	 var type_val=mediatype.getOptions()[mediatype.getValue()].value;
	 if(type_val=="photograph")
		{
		 	 var mediaref=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/mediaref");
			 //alert("mediaref:"+mediaref.getValue());					
		}
	}
}



function onChangePubWrapper()
{
	onChangePubname(IWDatacapture.getItem("/K4GenericXML/Target/pubname"));
}

/*Upon loading the DCR this function will set initial values*/

function setInitialValues() {
    if (isNew()) //New DCR
    {
    //IWDatacapture.getItem("/K4GenericXML/System MetaData/origin").setReadOnly(true);
    }
    
    IWDatacapture.getItem("/K4GenericXML/Target/edition").setVisible(false);
    IWDatacapture.getItem("/K4GenericXML/Target/issueidentifier").setVisible(false);
    IWDatacapture.getItem("/K4GenericXML/Target/subchannel1").setVisible(false);
    IWDatacapture.getItem("/K4GenericXML/Target/channel_att").setVisible(false);
    IWDatacapture.getItem("/K4GenericXML/Target/subchannel_att").setVisible(false);
    IWDatacapture.getItem("/K4GenericXML/Body/alttitle").setFocus();
    var channelItem = IWDatacapture.getItem("/K4GenericXML/Target/channel");
    var channelValue = '';
    //alert("final channelvalue is" + channelValue);
    if (!isNew()) {
        channelValue = trim(channelItem.getOptions()[channelItem.getValue()].value);
        //alert("final channelvalue in null loop is" + channelValue);
        if (channelValue == "203:california_construction_cities" || channelValue == "803:texas_construction_cities" || channelValue == "503:new_york_construction_cities" ||
            channelValue == "303:midwest_construction_cities" || channelValue == "403:mountainstates_construction_cities" ||
            channelValue == "603:southeast_construction_cities" ||
            channelValue == "703:southwest_construction_cities") {
        //alert("final channelvalue in if loop is" + channelValue);
        } else {
            //alert("final channelvalue in else loop is" + channelValue);
            IWDatacapture.getItem("/K4GenericXML/Body/title").setReadOnly(true);
        }
    }

    //IWDatacapture.getItem("/K4GenericXML/Body/title").setReadOnly(true);
    IWDatacapture.getItem("/K4GenericXML/System MetaData/issn").setReadOnly(true);
    IWDatacapture.getItem("/K4GenericXML/System MetaData/lang").setReadOnly(true);
    IWDatacapture.getItem("/K4GenericXML/System MetaData/identifier").setReadOnly(true);
    IWDatacapture.getItem("/K4GenericXML/System MetaData/publisher").setReadOnly(true);
    IWDatacapture.getItem("/K4GenericXML/System MetaData/corpentity").setReadOnly(true);
    IWDatacapture.getItem("/K4GenericXML/System MetaData/vol").setReadOnly(true);
    IWDatacapture.getItem("/K4GenericXML/System MetaData/num").setReadOnly(true);
    IWDatacapture.getItem("/K4GenericXML/System MetaData/startpage").setReadOnly(true);
    IWDatacapture.getItem("/K4GenericXML/System MetaData/copyright").setReadOnly(true);
    IWDatacapture.getItem("/K4GenericXML/System MetaData/subscription/price").setVisible(false);
    

}
function setInitialValues2()
{
	if(isNew()) //New DCR
	{
		//IWDatacapture.getItem("/K4GenericXML/System MetaData/origin").setReadOnly(true);
	}

	var channelvalue = "";

	IWDatacapture.getItem("/K4GenericXML/Target/edition").setVisible(false);
	IWDatacapture.getItem("/K4GenericXML/Target/issueidentifier").setVisible(false);
	IWDatacapture.getItem("/K4GenericXML/Target/subchannel1").setVisible(false);
	IWDatacapture.getItem("/K4GenericXML/Target/channel_att").setVisible(false);
	IWDatacapture.getItem("/K4GenericXML/Target/subchannel_att").setVisible(false);
				
	IWDatacapture.getItem("/K4GenericXML/Body/alttitle").setFocus();
	var channelItem=IWDatacapture.getItem("/K4GenericXML/Target/channel");
	
	 if ((channelItem.getValue() != null) && (channelItem.getValue() != undefined))
				{
	
	var channelValue = trim(channelItem.getOptions()[channelItem.getValue()].value);
	
	if (channelValue == "203:california_construction_cities" || channelValue == "803:texas_construction_cities" ||channelValue == "503:new_york_construction_cities" ||
			channelValue == "303:midwest_construction_cities" ||channelValue == "403:mountainstates_construction_cities" ||
			channelValue == "603:southeast_construction_cities" ||
			channelValue == "703:southwest_construction_cities" )
		{

			
		}

		else
		{
			
			IWDatacapture.getItem("/K4GenericXML/Body/title").setReadOnly(true);
		}
	}
		
		//IWDatacapture.getItem("/K4GenericXML/Body/title").setReadOnly(true);
	IWDatacapture.getItem("/K4GenericXML/System MetaData/issn").setReadOnly(true);
    IWDatacapture.getItem("/K4GenericXML/System MetaData/lang").setReadOnly(true);
    IWDatacapture.getItem("/K4GenericXML/System MetaData/identifier").setReadOnly(true);

	IWDatacapture.getItem("/K4GenericXML/System MetaData/publisher").setReadOnly(true);
	IWDatacapture.getItem("/K4GenericXML/System MetaData/corpentity").setReadOnly(true);
	IWDatacapture.getItem("/K4GenericXML/System MetaData/vol").setReadOnly(true);
	IWDatacapture.getItem("/K4GenericXML/System MetaData/num").setReadOnly(true);
	IWDatacapture.getItem("/K4GenericXML/System MetaData/startpage").setReadOnly(true);
	IWDatacapture.getItem("/K4GenericXML/System MetaData/copyright").setReadOnly(true);

	IWDatacapture.getItem("/K4GenericXML/System MetaData/subscription/price").setVisible(false);
	
	
}

/*Checks if the DCR is new using getDCRName method*/
function isNew() 
{                      
	var DCRName = IWDCRInfo.getDCRName();	    
	DCRName = (DCRName == "" || DCRName == null)?true:false;     
	return DCRName;
}

/*sets DCR name and calls finalize function*/
function saveDCR(DCRname) { 
	//alert("in saveDCR");     
	IWDCRInfo.setDCRName(DCRname,finalize);
	return true;
}
/* called by saveDCR.It saves the DCR*/
function finalize() 
{   
	//alert("in finalize");
	IWDatacapture.save();
	top._dcWin.datacapture_buttonframe.doSave();
	return true;
}

function generateXML()
{
	
	var dcrRelPath= IWDCRInfo.getDCRName();
	var dcrName = IWDatacapture.getDCRPath();
	
	var tplName= dctPath.substring(0,dctPath.length-15)+'presentation/article_XML.tpl';	
	var outFileName= waPath+'/'+dcrRelPath;

	var alttitle = IWDatacapture.getItem("/K4GenericXML/Body/alttitle").getValue();
	var keyword = IWDatacapture.getItem("/K4GenericXML/Body/keyword").getValue();
	var details = IWDatacapture.getItem("/K4GenericXML/Target/details_id").getValue();
	//alert("details-->"+details);
	
	var det_rep=IWDatacapture.getItem("/K4GenericXML/Target/destinations").getChildren();
	//alert(det_rep.length);
	var det_rep_value="";
	for(var i=0;i<det_rep.length;i++)
	{
		var j=i+1;
		
		if(det_rep.length>=1)
		{
			det_rep_value+= IWDatacapture.getItem("/K4GenericXML/Target/destinations["+ j +"]/details_id").getValue();			
		}
		if(j==det_rep.length)
		{
		det_rep_value+="";
		}
		else
		{
		det_rep_value+=",";
		}
	}
	var destination=details+","+det_rep_value;
	var desc = IWDatacapture.getItem("/K4GenericXML/Body/desc").getValue();
	var origin=IWDatacapture.getItem("/K4GenericXML/System MetaData/origin");
	var origintext ="";
		if (origin.getValue() != null)
			{
				origintext = origin.getOptions()[origin.getValue()].text;
				origintext=origintext.toLowerCase();
			}
		
	IWDatacapture.displayMessage("Generating XML... Please wait ... ",1000);
	var server = window.location.hostname;
	var params = new Object();
	params.dcrName=dcrName;
	params.tplName=tplName;
	params.outFileName=outFileName;
	params.alttitle=alttitle;
	params.keyword=keyword;
	params.destination=destination;
	params.desc=desc;
	params.origin=origintext;
	IWDatacapture.callServer("http://"+server+"/iw-bin/custom/common/generate.ipl",params,true);
}


function generateComplete(output)
{
	if (output.length>0)
	{
		IWDatacapture.displayMessage("Generation of XML Failed... "+output+"\nContact Administrator...");		
	}
	else
	{
		IWDatacapture.displayMessage("Generation of XML Succeded...");
		setTimeout("IWDatacapture.displayMessage()",5000);		
	}
}

function getImages()
{
	var media_images="";
	var medias= IWDatacapture.getItem("/K4GenericXML/Media/media").getChildren();
	for(i=0;i<medias.length;i++)
	{
	 j=i+1;
	 var mediatype=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/mediatype");
	 var type_val=mediatype.getOptions()[mediatype.getValue()].value;
	 if(type_val=="photograph" || type_val=="chart" || type_val=="graph" || type_val=="map")
		{
		 	j=i+1;
			media_images+=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/mediaref").getValue();			
			media_images+=",";
		}

	}	
	return media_images;
}





 function sleep(milliSeconds){
    var startTime = new Date().getTime(); // get the current time
    while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}

function onRepAddDisableVideoID(item)
{
	IWDatacapture.getItem(item.getName()+"/videoid").setVisible(false);
	IWDatacapture.getItem(item.getName()+"/channelid").setVisible(false);
}
function onRepAddDisableCreatorText(item)
{
	//IWDatacapture.getItem(item.getName()+"/creatortext").setVisible(false);
	//IWDatacapture.getItem(item.getName()+"/placetext").setVisible(false);
}

function onRepAddMedia(item)
{
	IWDatacapture.getItem(item.getName()+"/alt_title").setVisible(false);
	IWDatacapture.getItem(item.getName()+"/FeaturedHeadline").setVisible(false);
	IWDatacapture.getItem(item.getName()+"/videoid").setVisible(false);
	IWDatacapture.getItem(item.getName()+"/channelid").setVisible(false);
}



function displayCSMsg(msg,milisec,status)
{
	if(status == 'start')
	{
		IWDatacapture.displayMessage(msg,milisec);
	}
	else if(status == 'end')
	{
		IWDatacapture.displayMessage(msg);
		setTimeout("IWDatacapture.displayMessage()",milisec);
	}

}

function getCharacterCount(item)
{
	 var text=item.getValue();                      
         text = text.replace(/<[^>]+>/g, '');			// Strip out all tags.			
    	 text = text.replace(new RegExp( "\\n", "g" ),"" ); 	// Strip out all line breaks.
		 text = text.replace(new RegExp( "\&#160;", "g" ),"" );	//	Strip out non breaking space character.	
//	IWDatacapture.getItem("/K4GenericXML/Body/charcount").setValue(text.length);
}

function getWordCount(item)
{
	 var text=item.getValue();                      
         text = text.replace(/<[^>]+>/g, '');			// Strip out all tags.			
    	 text = text.replace(new RegExp( "\\n", "g" ),"" ); 	// Strip out all line breaks.
		 text = text.replace(new RegExp( "\&#160;", "g" ),"" );	//	Strip out non breaking space character.	
		 text = text.replace(/\s/g,' ');
	var temp= text.split(' ').length;
		
	IWDatacapture.getItem("/K4GenericXML/Body/wordcount").setValue(temp.toString());

}

function setOrigin()
{
//	alert("in origin");
	newOptions = new Array();
	var origin=IWDatacapture.getItem("/K4GenericXML/System MetaData/origin");
	var len=origin.getOptions().length;
	for(i=0;i<len;i++)
	{
		//alert(origin.getOptions()[i].value+":"+origin.getOptions()[i].text);		
		if(origin.getOptions()[i].text == "Web")
			newOptions[i] = new Option(origin.getOptions()[i].text, origin.getOptions()[i].value, false, true);
		else
			newOptions[i] = new Option(origin.getOptions()[i].text, origin.getOptions()[i].value, false, false);
	}
	origin.setOptions(newOptions);
}

function onChangePubname(item)
{
	var pub="";
	if (item.getValue() != null)
		pub = item.getOptions()[item.getValue()].value;
	var site_id=pub.split(':')[0];//alert("site_id:"+site_id);		
	var site_name=pub.split(':')[1];
	
		if(site_name == "ENR")
		{
			IWDatacapture.getItem("/K4GenericXML/Target/subchannel1").setVisible(true);
		}
		else
		{
			IWDatacapture.getItem("/K4GenericXML/Target/subchannel1").setVisible(false);
			IWDatacapture.getItem("/K4GenericXML/Target/subchannel_att").setVisible(false);
		}
	
	
	var nextfun=null;
		nextfun="populate_channelsDB_callback()";
    	
	if(isNew())
	{		
			//alert("nextfun:"+nextfun);
			populate_channelsDB(nextfun,null,site_id,'/K4GenericXML/Target/channel');			
	}
	else
	{		
		var channel_id=getChannel().split(':')[0];
		populate_channelsDB(nextfun,channel_id,site_id,'/K4GenericXML/Target/channel')

	}
}




function populate_channelsDB_callback()
{
	var nextfun=null;
	var pub=getPub();
	var site_id=pub.split(':')[0];//alert("ch:"+channel_id);		
	var site_name=pub.split(':')[1];
	if(isNew())
	{
		nextfun="populate_originDB_callback()";//alert("nextfun:"+nextfun);
		populate_originDB(nextfun,null,site_id,'/K4GenericXML/System MetaData/origin');
	}
	else
	{
		var channel_id=getChannel().split(':')[0];
		var org_id=getOrigin();//		alert("site_name:"+site_name);
		if(site_name == "ENR")
		{
			var subchannel=IWDatacapture.getItem("/K4GenericXML/Target/subchannel1");//alert("subch len:"+subchannel.getOptions().length);

			if(subchannel.getOptions().length !=0)
			{
				var subch=subchannel.getOptions()[subchannel.getValue()].value; //alert("subch:"+subch);
				if(subch != null)
				{
					var subchannel_id=subch.split(':')[0];//alert("subchannel_id:"+subchannel_id);
					nextfun="populate_subchannelsDB_callback()";
					populate_subchannelsDB(nextfun,subchannel_id,channel_id,'/K4GenericXML/Target/subchannel1');						
				}
			}
			else	
				populate_originDB('populate_originDB_callback()',org_id,site_id,'/K4GenericXML/System MetaData/origin');

		}
		else 			
			populate_originDB('populate_originDB_callback()',org_id,site_id,'/K4GenericXML/System MetaData/origin');
	}

}



function populate_originDB_callback()
{
	if(isNew())
	{
		setOrigin();
	}
	else
	{
		var nextfun="populate_channels_attDB_callback()";
		var ch_att=IWDatacapture.getItem("/K4GenericXML/Target/channel_att");
		ch_att.setVisible(true);
		var ch_att_val=ch_att.getValue();
		var chatt_id=null;
		channel_id=getChannel().split(':')[0];		//alert("ch_att_val:"+ch_att_val);

		if(ch_att_val != null)
		{
			ch_att.setVisible(true);
			var chatt_id=ch_att.getOptions()[ch_att.getValue()].value;//alert("chatt_id:"+chatt_id);		
		}
		populate_channels_attDB(nextfun,chatt_id,channel_id,'/K4GenericXML/Target/channel_att');			
	}
}


function populate_channels_attDB_callback()
{
	//alert("in callback of populate_channels_attDB_callback");
	if(!isNew())
	{
		var nextfun=null;
		if(getPub().split(':')[1] =="ENR")
		{
			nextfun="populate_subchannels_attDB_callback()";
			var subch_att=IWDatacapture.getItem("/K4GenericXML/Target/subchannel_att");
			subch_att.setVisible(true);
			var subch_att_val=subch_att.getValue();
			var subchatt_id=null;
			subchannel_id=getSubChannel().split(':')[0]; 		//alert("subch_att_val:"+subch_att_val);

			if(subch_att_val != null)
			{
				subch_att.setVisible(true);
				subchatt_id=subch_att.getOptions()[subch_att.getValue()].value;//alert("subchatt_id:"+subchatt_id);		
			}
			populate_subchannels_attDB(nextfun,subchatt_id,subchannel_id,'/K4GenericXML/Target/subchannel_att');
		}
		else
		{
			populateDestWrapper();
		}
	}
}

function populate_subchannels_attDB_callback()
{
	//alert("in callback of populate_subchannels_attDB_callback");
	populateDestWrapper();
}

function populate_subchannelsDB_callback()
{
	var nextfun="populate_originDB_callback()";
	var site_id=getPub().split(':')[0];
	var org_id=getOrigin();
	populate_originDB(nextfun,org_id,site_id,'/K4GenericXML/System MetaData/origin');
}

function getPub()
{
	var pub="";
	var item=IWDatacapture.getItem("/K4GenericXML/Target/pubname");
	if (item.getValue() != null)
			pub = item.getOptions()[item.getValue()].value;

	return pub;	
}

function getChannel()
{
	var item=IWDatacapture.getItem("/K4GenericXML/Target/channel");
	var channel=item.getOptions()[item.getValue()].value;
	return channel;
}

function getSubChannel()
{
	var item=IWDatacapture.getItem("/K4GenericXML/Target/subchannel1");
	var subchannel=item.getOptions()[item.getValue()].value;
	return subchannel;
}

function getOrigin()
{
		var origin=IWDatacapture.getItem("/K4GenericXML/System MetaData/origin");
		if(origin.getValue() != null)
			return origin.getOptions()[origin.getValue()].value;
		else
			return null;
}


function onChangeEdition(item)
{
	//alert("in change editon");
	var ed="";
	if (item.getValue() != null)
	{
		ed = item.getOptions()[item.getValue()].value;
		var pub="";
		var pubitem=IWDatacapture.getItem("/K4GenericXML/Target/pubname");
		if (pubitem.getValue() != null)
			pub = pubitem.getOptions()[pubitem.getValue()].value;
		if(pub == 'region')
		{
			//alert("ed:"+ed);
			var edition_id=ed.split(',')[0];//alert("ed:"+edition_id);		
			populate_channelsDB(null,null,edition_id,'/K4GenericXML/Target/channel');			
		}
	}
}

function onChangeChannel(item)
{
		var channel="";
		IWDatacapture.getItem("/K4GenericXML/Target/channel_att").setVisible(true);
		var nextfun=null;
		var channel_id='100';
	if (item.getValue() != null && item.getValue() != "" )
	{
		channel = item.getOptions()[item.getValue()].value;		//alert("ch:"+channel);
		channel_id=channel.split(':')[0];//alert("ch:"+channel_id);		
		var pub=getPub();
		var site_id=pub.split(':')[0];
		var site_name=pub.split(':')[1];
		if(site_name=="ENR")
			nextfun="populate_subchannelsDB(null,null,'"+channel_id+"','/K4GenericXML/Target/subchannel1')";	
		else
			nextfun=null;

		populate_channels_attDB(nextfun,null,channel_id,'/K4GenericXML/Target/channel_att');
	}
	else if(item.getValue() == "")
	{
		
		IWDatacapture.getItem("/K4GenericXML/Target/channel_att").setVisible(false);
	}
    //	populate_channels_attDB(nextfun,null,channel_id,'/K4GenericXML/Target/channel_att');
}

function onChangeSubChannel(item)
{
		var subchannel="";
		IWDatacapture.getItem("/K4GenericXML/Target/subchannel_att").setVisible(true);
		var nextfun=null;
	if (item.getValue() != null && item.getValue() != "")
	{
		subchannel = item.getOptions()[item.getValue()].value;		//alert("ch:"+channel);
		var subchannel_id=subchannel.split(':')[0];
		populate_subchannels_attDB(nextfun,null,subchannel_id,'/K4GenericXML/Target/subchannel_att');
	}
	else if(item.getValue() == "")
	{
		IWDatacapture.getItem("/K4GenericXML/Target/subchannel_att").setVisible(false);
	}
}


function populate_issueidentifier(nextfun)
{
	var params = new Object();
		params.xmlfile="mhc/enr/config/ENRInlineValues.xml";
		params.toset = "/K4GenericXML/Target/issueidentifier";
		params.xpath ="//Root/Common/Regions";
		params.select="false";
		params.nextfun=nextfun;	
		params.option=null;
		displayCSMsg("Populating Issue Identifier...",1000,"start");
		getOptionTags(params);
		displayCSMsg("Populating Issue Identifier... Done",5000,"end");
}

function onChangeMediaType(item)
{

			if(item.getValue() == null){
			newOptions = new Array();
			newOptions[0] = new Option("Select...", "0", false, false);
			newOptions[1] = new Option("Image", "photograph", false, true);
			newOptions[2] = new Option("Video", "video", false, false);
			newOptions[3] = new Option("Headshot", "head shot", false, false);
			newOptions[4] = new Option("Chart", "chart", false, false);
			newOptions[5] = new Option("Graph", "graph", false, false);
			newOptions[6] = new Option("Map", "map", false, false);
			item.setOptions(newOptions);
			}
			
		var type=item.getOptions()[item.getValue()].value;
		//alert("item.tostring()----" +item.toString());
		var ord=item.getName().match(/\[\d+\]/);
		
		if(type == 'video')
		{
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/videoid").setVisible(true);
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/channelid").setVisible(true);
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/mediaref").setVisible(false);
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/mediaref").setValue("");
			//IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/imageexpiry").setVisible(false);
		}
		else
		{
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/videoid").setVisible(false);
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/videoid").setValue("");
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/channelid").setVisible(false);
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/channelid").setValue("");
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/mediaref").setVisible(true);
			//IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/imageexpiry").setVisible(true);
		}
		if(type == 'photograph'|| type=='chart' || type=='graph' || type=='map')
		{
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/alt_title").setVisible(true);
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/FeaturedHeadline").setVisible(true);
		}
		else
		{
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/alt_title").setVisible(false);
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/FeaturedHeadline").setVisible(false);
		}
		if(type == 'head shot')
		{
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/videoid").setVisible(false);
			IWDatacapture.getItem("/K4GenericXML/Media/media"+ord+"/channelid").setVisible(false);
		}
		//populate_mediaformat(type,ord,null);
}


function populate_mediaformat(mediatype,ord,nextfun)
{
	var params = new Object();
		params.xmlfile="mgh/config/GenericInlineValues.xml";
		params.toset = "/K4GenericXML/Media/media"+ord+"/mediaformat";
		params.xpath ="//Root/Media/Type[@value='"+mediatype+"']";
		params.select="true";
		params.nextfun=nextfun;
		params.option=null;
		displayCSMsg("Populating Media Format...",1000,"start");
		getOptionTags(params);
		displayCSMsg("Populating Media Format... Done",3000,"end");
}

function getOptionTags(params)
{
		IWDatacapture.callServer("http://"+window.location.hostname+"/iw-cc/mgh/common/getOptionTags.jsp",params,false);				
}


function onChangeCreator(item)
{
	var ord=item.getName().match(/\[\d+\]/);
	if (item.getValue() != null)
	{
		if(item.getOptions()[item.getValue()].value == "Others")
		{
			//IWDatacapture.getItem("/K4GenericXML/Body/creatorgroup"+ord+"/creatortext").setVisible(true);		
		}
		else
		{
			//IWDatacapture.getItem("/K4GenericXML/Body/creatorgroup"+ord+"/creatortext").setVisible(false);		
		}
	}
}

function onChangePlace(item)
{
	var ord=item.getName().match(/\[\d+\]/);
	if (item.getValue() != null)
	{
		if(item.getOptions()[item.getValue()].value == "Others")
		{
			IWDatacapture.getItem("/K4GenericXML/Body/creatorgroup"+ord+"/placetext").setVisible(true);		
		}
		else
		{
			IWDatacapture.getItem("/K4GenericXML/Body/creatorgroup"+ord+"/placetext").setVisible(false);		
		}
	}
}

function settingDone(item)
{
	//place holder for debugging only
	//alert("item:"+item);
	
}

//#################################################################
//#Function Name :importFromDesktop
//#Purpose :Used for Import from Desktop functionality
//#Argument:Item
//#Return  :Selected File path is returned to the item.
//#################################################################
function importFromDesktop(item)
{
	var itemName=item.getName();
	window.open('/iw-cc/command/iw.livesite.import_dialog?vpath='+waPath+'&amp;ceiling='+waPath+'&amp;hier_callback=eval(callback_1=function(path){opener.parent.getScriptFrame().browseCallback(path,"'+itemName+'",true);})&amp;show_thumbnail=true',"","width=547,height=437,resizable=yes");
}

//#################################################################
//#Function Name :browseCallback
//#Purpose :Sub Routine for Import from Desktop functionality
//#Argument:Filepath,Name of the Item
//#Return  :returns filepath
//#################################################################
function browseCallback(filepath,Name){
	var result=filepath.toString();
	var arrResult=result.split(waPath);
	arrResult[1]=arrResult[1].replace(/,/,"");
	IWDatacapture.getItem(Name).setValue(arrResult[1]);
	return true;
}

/*
function handleReplicantAdd(item)
{
    var xpath = getXPath( item );
	object = xpath.substring(0,xpath.length-3);		

	if (object == "/K4GenericXML/Body/relatedarticlesgroup")
	{
		var xpath_target = xpath + "/target";
		var objTarget=IWDatacapture.getItem(xpath_target);
		//objTarget.getOptions()[1].selected = true;
		//objTarget.setOptions(1);
	}
}
*/

//A function to get the xpath of the replicant
function getXPath( item )
{
	var xpath = null;
	if ( typeof( item.getXPath ) != 'undefined' )
		{
			xpath = item.getXPath();
		}else{
			xpath = item.getName();
		}
	return( xpath );
}


function setPreviewTPL() {
	var channelItem = IWDatacapture.getItem("/K4GenericXML/Target/channel");
	var channelValue = trim(channelItem.getOptions()[channelItem.getValue()].value);
	var channelText = trim(channelItem.getOptions()[channelItem.getValue()].text);
	var section = trim(IWDatacapture.getItem("/K4GenericXML/Target/section").getValue());
	var pulse = false;
	if ( ((channelText == "Resources") && (section == "Pulse")) || (channelText == "Dodge Reports - Pulse")){
		pulse = true;
	}
	var tplObjects = new Array();
	tplObjects = IWPageGeneration.getValidPresentationTemplates();
	var isCityScoopDCR = /_cities/.test(IWDatacapture.getDCRPath());
	for (i = 0; i < tplObjects.length; i++) {
		if (pulse) {
			if (tplObjects[i].getName() == "dodge_preview.tpl") {
				IWPageGeneration.setPresentationTemplate(tplObjects[i]);
				break;
			}/*Line # 934-942 has been added/Changed on Sep-20-2011 for setting default preview for citiScoop DCR's.*/
		} else if (isCityScoopDCR && tplObjects[i].getName() == "regions_preview.tpl") {
			IWPageGeneration.setPresentationTemplate(tplObjects[i]);
			break;
			
		} else if (!pulse && !isCityScoopDCR && tplObjects[i].getName() == "article_preview.tpl") {
			IWPageGeneration.setPresentationTemplate(tplObjects[i]);
			break;
			
		}
	}
	
	return "";
	
}
 

function close_routine()
{
	top._dcWin.datacapture_buttonframe.regenerateNeedsTobeDone=false;
	return true;
}


//#################################################################
//#Function Name :trim
//#Purpose :To trim space at the begining or at the end with 
//#Argument:String value
//#Return  :String value
//#################################################################
function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}


//Autnaming functions Start//

function validateDcr()
{
	//alert('in validatedcr');	
	
	var mobileImageCount=0;
	var v_details=IWDatacapture.getItem("/K4GenericXML/Target/details_id").getValue();	
	var det_rep=IWDatacapture.getItem("/K4GenericXML/Target/destinations").getChildren();
	var det_rep_value="";
	for(var i=0;i<det_rep.length;i++)
	{
		var j=i+1;
		if(det_rep.length>1)
		{
			det_rep_value+= IWDatacapture.getItem("/K4GenericXML/Target/destinations["+ j +"]/details_id").getValue();		
		}
		det_rep_value+=","		
	}
	var destination=v_details+","+det_rep_value;
	
	var s_webTitle=IWDatacapture.getItem("/K4GenericXML/Body/alttitle");
	var s_coverDate=IWDatacapture.getItem("/K4GenericXML/Body/coverdate");
	var s_pubDate=IWDatacapture.getItem("/K4GenericXML/Body/pubdate");
	var s_pubName=IWDatacapture.getItem("/K4GenericXML/Target/pubname");


	var val_pubName="";
	var val_channel="";
   if(s_pubName.getValue() > 0 && s_pubName.getValue() != null)
		val_pubName=s_pubName.getOptions()[s_pubName.getValue()].text;


	var s_channel=IWDatacapture.getItem("/K4GenericXML/Target/channel");	
    var s_embargo=IWDatacapture.getItem("/K4GenericXML/Body/embargoDate");
	var s_subscription=IWDatacapture.getItem("/K4GenericXML/System MetaData/subscription/paydate");
	var s_subchannel=IWDatacapture.getItem("/K4GenericXML/Target/subchannel1");
	 if(s_channel.getValue() > 0 && s_channel.getValue() != null)
	 val_channel = s_channel.getOptions()[s_channel.getValue()].text;

	var val_subchannel="";
	 if(s_subchannel.getValue() > 0 && s_subchannel.getValue() != null)
     val_subchannel = s_subchannel.getOptions()[s_subchannel.getValue()].text;


	var v_webTitle=IWDatacapture.getItem("/K4GenericXML/Body/alttitle").getValue();
	var v_coverDate=IWDatacapture.getItem("/K4GenericXML/Body/coverdate").getValue();
	var v_pubDate=IWDatacapture.getItem("/K4GenericXML/Body/pubdate").getValue();
	var v_pubName=IWDatacapture.getItem("/K4GenericXML/Target/pubname").getValue();
	var v_channel=IWDatacapture.getItem("/K4GenericXML/Target/channel").getValue();
	var v_subchannel=IWDatacapture.getItem("/K4GenericXML/Target/subchannel1").getValue();

	var v_origin= IWDatacapture.getItem("/K4GenericXML/System MetaData/origin");
	var s_origin="";
	
	//alert("v_origin.getValue()------------------"+v_origin.getOptions()[v_origin.getValue()].text);
   if(v_origin.getOptions()[v_origin.getValue()].value > 0 )
	{
		s_origin=v_origin.getOptions()[v_origin.getValue()].text;
	}
   else
	{
		alert("Select an Origin");
		v_origin.setFocus();
		return false;
	}
	
	var det_rep=IWDatacapture.getItem("/K4GenericXML/Target/destinations").getChildren();	
	

	for(var i=0;i<det_rep.length;i++)
	{
		var j=i+1;
			var site_item=IWDatacapture.getItem("/K4GenericXML/Target/destinations["+j+"]/site");
			if(site_item.getValue() != null && site_item.getValue() > 0){		
				var site_value = site_item.getOptions()[site_item.getValue()].text;		
			}

			else
			{
				
				site_item.setFocus();
				alert("Please enter Site value");
				return false;

			}
					
			var channel_item=IWDatacapture.getItem("/K4GenericXML/Target/destinations["+j+"]/channel");
			if(channel_item.getValue() != null && channel_item.getValue() > 0 ){			
			var channel_value = channel_item.getOptions()[channel_item.getValue()].text;		
			}

			else
			{
				
				channel_item.setFocus();
				alert("Please enter Channel value");
				return false;

			}

			var subchannel_item=IWDatacapture.getItem("/K4GenericXML/Target/destinations["+j+"]/subchannel");		
			if(subchannel_item.getValue() != null && subchannel_item.getValue() > 0){	
			var subchannel_value = subchannel_item.getOptions()[subchannel_item.getValue()].text;		
			}

			else
			{
				if (site_item.getValue() != 1 )
				{
				}
				else
				{
				subchannel_item.setFocus();
				alert("Please enter Sub channel value");
				return false;
				}

			}

			if(val_pubName == site_value && val_subchannel == subchannel_value && val_channel == channel_value)
			{
				alert("Both Source and Destination cannot be same. Please choose different  subchannel in the destination");
				subchannel_item.setFocus();	
				return false;
			}
	}
	
	
	
	
//	if(v_embargo=="")
//	{
//		var currentTime = new Date();
//		var day = currentTime.getDate();
//		var month = currentTime.getMonth()+1;
//		var year = currentTime.getFullYear();
//		var newmonth="";
//			if(month<10)
//				{
//					newmonth="0"+month;
//				}
//			else
//				{
//					newmonth=month;
//				}
//		s_pubDate.setValue(year+"-"+newmonth+"-"+day);
//     }
	
	if((v_webTitle==""))
	{
		alert("Web Title cannot be empty");
		s_webTitle.setFocus();
		return false;
	}
	
	if(v_pubName=="")
	{
		alert("Select the site");
		s_pubName.setFocus();
		return false;
	}

	if(v_channel=="")
		{
			alert("Select the Channel");
			s_channel.setFocus();
			return false;
		}
	if(val_pubName=="ENR")
	{
		IWDatacapture.getItem("/K4GenericXML/Target/subchannel1").setRequired(true);
		if(v_subchannel=="")
		{
		alert("Select the subchannel");
		return false;
		}
	}
	else
	{
		IWDatacapture.getItem("/K4GenericXML/Target/subchannel1").setRequired(false);
	}

	
	if(v_pubDate == "")
		{
			alert("Publish Date is not set");
            IWDatacapture.getItem("/K4GenericXML/Body/pubdate").setReadOnly(false)
			s_pubDate.setFocus();
            IWDatacapture.getItem("/K4GenericXML/Body/pubdate").setReadOnly(true)  
			return false;
		}

	var s_keyword=IWDatacapture.getItem("/K4GenericXML/Body/keyword")
	var v_keyword=IWDatacapture.getItem("/K4GenericXML/Body/keyword").getValue();
	if(v_keyword=="")
	{
		alert("Please Enter Keyword");
		s_keyword.setFocus();
		return false;
	}

	var s_desc=IWDatacapture.getItem("/K4GenericXML/Body/desc")
	var v_keyword=IWDatacapture.getItem("/K4GenericXML/Body/desc").getValue();
	if(v_keyword=="")
	{
		alert("Please Enter Description");
		s_desc.setFocus();
		return false;
	}

	var s_teaser=IWDatacapture.getItem("/K4GenericXML/Body/teaser")
	var v_teaser=IWDatacapture.getItem("/K4GenericXML/Body/teaser").getValue();
	if(v_teaser=="")
	{
		alert("Please Enter Teaser");
		s_teaser.setFocus();
		return false;
	}

	var s_byline=IWDatacapture.getItem("/K4GenericXML/Body/byline")
	var v_byline=IWDatacapture.getItem("/K4GenericXML/Body/byline").getValue();
	if(v_byline=="")
	{
		alert("Please Enter Byline");
		s_byline.setFocus();
		return false;
	}


	var v_embargo=s_embargo.getValue();
		v_embargo=trim(v_embargo);
	var date="";
	if(v_embargo!="" && v_embargo!=null)
	{
		date=v_embargo.split(' ')[0];
	}
	else
	{
		var pub_date=IWDatacapture.getItem("/K4GenericXML/Body/pubdate").getValue();
		date=pub_date.split(' ')[0];			
	}
	date=trim(date);
	IWDatacapture.getItem("/K4GenericXML/System MetaData/subscription/paydate").setValue(getOffsetDate(date,7));
	

	
    var medias= IWDatacapture.getItem("/K4GenericXML/Media/media").getChildren();
		var ct=getPhotoCount();	
var temp="test";	
	var inc=0;
	for(i=0;i<medias.length;i++)
		{
		//alert(medias.length);
				j=i+1;
				var s_credit=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/credit");
				var v_credit=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/credit").getValue();
				var s_caption=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/caption");
				var v_caption=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/caption").getValue();
				var mediatype=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/mediatype");
				var type_val=mediatype.getOptions()[mediatype.getValue()].value;
				var mediaref=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/mediaref");
				var mediarefValue=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/mediaref").getValue();
	            var s_alttitle=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/alt_title");
				var v_alttitle=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/alt_title").getValue();
				v_alttitle=trim(v_alttitle);
				var s_imageexpiry=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/imageexpiry");
				var v_imageexpiry=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/imageexpiry").getValue();
                var v_videoembeddedid=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/videoembeddedid").getValue();
				var s_videoembeddedid=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/videoembeddedid");
				//var tocheckedit=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/tocheckedit").getValue();
				var videoid=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/videoid").getValue();
				var channelid=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/channelid").getValue();
				
				inc=0;
				if(medias.length > 0)
				{
					var image_expiry;
					//var image_expiry_date =s_imageexpiry.getOptions()[s_imageexpiry.getValue()].value;
					//var image_expiry_days = image_expiry_date.split("/");

					var image_expiry_date = "";
					var image_expiry_days = "";
					if( s_imageexpiry.getValue() == null)
					{
					s_imageexpiry.setValue(0);
					}

		           if(s_imageexpiry.getValue() > 0 && s_imageexpiry.getValue() != null)

					{
					 image_expiry_date =s_imageexpiry.getOptions()[s_imageexpiry.getValue()].value;
					 image_expiry_days = image_expiry_date.split("/");
					}
					
					
					if(image_expiry_days[1] != 0)
					{
						var currentdate = new Date();
						
						if(v_embargo != "")
						{
							image_expiry = v_embargo;
						}
						else
						{
							image_expiry = v_pubDate;
						}

						image_expiry_date = image_expiry.split("-");
						var date = image_expiry_date[2].split(" ");
						
						var x=new Date();
						x.setFullYear(image_expiry_date[0],image_expiry_date[1]-1,date[0]);
						var today = new Date();

						var expired_date = x.setDate(x.getDate()+parseInt(image_expiry_days[1]));
						var current_date = new Date().setDate(today.getDate()+0);
						
						if (current_date>expired_date)
						  {
							var imagename=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/mediaref").getValue();
							  alert("The image "+imagename+" in conatiner"+j+" is already expired");
							  imagename=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/mediaref").setFocus();
						  
						  }
					}

				}
			//alert("media type is null");
			if(type_val=="select"||type_val=="")
			{
				alert("Please Enter Media Type");
				mediatype.setFocus();
				return false;
			}
			
			if(trim(mediarefValue)==""&& type_val!="video")
			{
				alert("Please select an Image");
				mediaref.setFocus();
				return false;
			}

					
			if(v_credit=="")
				{
					alert("Please Enter Credit");
					s_credit.setFocus();
					return false;
				}
							
			 if(v_caption=="")
				{
					alert("Please Enter Caption");
					s_caption.setFocus();
					return false;
				}
			if(type_val=="photograph" || type_val=="chart" || type_val=="graph" || type_val=="map")
				{
					if(v_alttitle=="")
						{
							if(v_caption != "na" && v_caption !="NA")
							{
								 s_alttitle.setValue(v_caption);
							}
						
						 }

//if(ct>2)
	//{
	
	//if(v_imageexpiry==3 || v_imageexpiry==1 || v_imageexpiry==2 || v_imageexpiry==null)
		//{
							//	alert ("Please set image expiry to default value of No Expiration");			
							//	s_imageexpiry.setFocus();
							//	return false;
		//}
	//}


				 }
		//setting Mobile Image Value:start
			var mobileImage=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/MobileImage").getValue();

					if(mobileImage =="0")
					{
						mobileImageCount++;
						
						if(mobileImageCount == 1)
						{
							var mobileImageValue=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/mediaref").getValue();
							IWDatacapture.getItem("/K4GenericXML/Body/mobileimage").setValue(mobileImageValue.split('.')[0]+"_rss."+mobileImageValue.split('.')[1]);						
						}
						else if(mobileImageCount>1)
						{
							alert("Multiple Images are Checked for Mobile Image, Please check only one Image for Mobile Image");
							IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/MobileImage").setFocus();
							return false;
						}
						else
						{
						//Do Nothing
						}
					
					}
			//setting Mobile Image Value:End
			
		//	if((videoid !="") &&  (channelid!="") && (v_videoembeddedid=="") && (tocheckedit=="") ) 
				if((videoid !="") &&  (channelid!="") && (v_videoembeddedid=="")) 
			 {
				 alert("Video Embedded Code for "+ j + " container is empty");
				 //var confRet = window.confirm ("Video Embedded Code Field is empty.");
				 IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/videoembeddedid").setFocus(true);
				 return false;            
             			 
			 }  
         
		}
    			
	
	//alert(s_origin);
	if(s_origin=="Web") // for web
	{		
		IWDatacapture.getItem("/K4GenericXML/Body/coverdate").setRequired(false);
		IWDatacapture.getItem("/K4GenericXML/Body/coverdate").setReadOnly(false);		
	}
	else
	{
		IWDatacapture.getItem("/K4GenericXML/Body/coverdate").setRequired(true);
		if((v_coverDate==""))
		{
			alert("Cover Date not yet set !!!");
			s_coverDate.setFocus();
			return false;
		}
	}


	var iMedia=IWDatacapture.getItem("/K4GenericXML/Media/media");
	var iChannel_attr=IWDatacapture.getItem("/K4GenericXML/Target/channel_att");
	 
	var isubChannel_attr=IWDatacapture.getItem("/K4GenericXML/Target/subchannel_att");

	var test = isubChannel_attr.getValue();
	//alert ( "value of test is:" + test);
		
	if((iChannel_attr.getValue() != null) || (isubChannel_attr.getValue() != null))
	 {
		

		
		var attr_val = iChannel_attr.getOptions()[iChannel_attr.getValue()].value;
		var sattr_val = "";

		

		if(isubChannel_attr.getValue() != null && isubChannel_attr.getValue() > 0)
		 {
		  sattr_val = isubChannel_attr.getOptions()[isubChannel_attr.getValue()].text;
		 }

		//alert("attr_val:"+attr_val); //val:10, label=name	
	
			if((attr_val != null && attr_val !="") || (sattr_val != null && sattr_val !=""))

			{
				var fcount=0;
				var checkCount=0;
				var medias= IWDatacapture.getItem("/K4GenericXML/Media/media").getChildren();
				for(i=0;i<medias.length;i++)
				 {
					j=i+1;
					var feature=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/FeaturedHeadline").getValue();
					//alert("feature:"+feature);
					if(feature=="")
					{
						fcount++;
					}
					else
					{
						checkCount++;
					}
				}
				//alert("checkCount:"+checkCount);
				
				if(checkCount==0)
				{
					alert("Please check an Image for Feature Headline");		
					iMedia.setFocus();
					return false;

				}
				else if(checkCount==1)
				{
					// do nothing
				}
				else
				{
					alert("Multiple Images are Checked, Please check only one Image for Feature Headline");		
					iMedia.setFocus();
					return false;
				}	
			}
	 }
	 

	setDcrName();	

	if(isNew())
	{
		return false;
	}
	else 
	{
		return true;
	}
	
}


function setDcrName()
{   
	
	if(isNew())
	{
			form_relpath();//constructs the relpath=xml/enr-regionpub/channel/subchannel-edition/yyyy
			create_relpaths("autoname();");//creates the relPath in wa/templatedata/data/... and in wa/xml/....
	}
	else
	{	//alert("setdcrname else");
		//IWDatacapture.save();
	}
 } 


function autoname()
{
	var pub_date=IWDatacapture.getItem("/K4GenericXML/Body/pubdate").getValue();
	var date=pub_date.split(' ')[0].split('-');
	var alttitle=IWDatacapture.getItem("/K4GenericXML/Body/alttitle/").getValue();			//alttitle=alttitle.replace(/\s+/g, '_');			// Replace space with "_".
	


	alttitle=alttitle.replace(new RegExp( "&amp;", "g" ),"");//remove the &amp;
		alttitle=alttitle.replace(/[!"#$%&'()*+,./:;<=>?@[\]^_`{|}~]/g,"");//remove any of this One of !"#$%&'()*+,./:;<=>?@[\]^_`{|}~
		alttitle=alttitle.replace(new RegExp( "\\s+", "g" )," ");//replace multi spaces to single space;
		alttitle=alttitle.replace(new RegExp( " ", "g" ),"-");//replace space with '-';
		alttitle=trim(alttitle);
	
	//alttitle=alttitle.replace(new RegExp( "\\W", "g" ),"");			// Replace all punctuation and space with "".			
	var filename=date[1]+date[2]+"-"+alttitle+".xml";
	filename=relPath+filename; // adding the relPath generated from "form_relpath()"
	saveDCR(filename);
}


 //Autonaming functions End//
function onCoverDate(item)
{
	if(isNew())
	{
		//return true;
	}
	else
	{		
		if(IWDatacapture.getItem("/K4GenericXML/Body/coverdate") !="")
		{
			alert("Cover Date is already set!!!");
			IWDatacapture.getItem("/K4GenericXML/Body/coverdate").setReadOnly(true);
			//return false;
		}
	}
}

function setcopyright()
{
	var text=IWDatacapture.getItem("/K4GeneriXML/System MetaData/copyright").getValue();
	//	alert("1  :"+text);
//		text=text.replace(/169/,'hello');
		 text = text.replace(new RegExp( "\&#169;", "g" )," hello " )
	//	alert("2  :"+text);
		IWDatacapture.getItem("/K4GenericXML/System MetaData/copyright").setValue(text);
	//	alert("3  :"+IWDatacapture.getItem("/K4GenericXML/System MetaData/copyright").getValue());

}


// for creating the relative path of enr-regionpub/channel/subchannel-edition/yyyy


function form_relpath()
{
	//alert("form_relpath");
	var pubname=IWDatacapture.getItem("/K4GenericXML/Target/pubname");
	var path="xml/";
	var channel="ch";
	var chItem=IWDatacapture.getItem("/K4GenericXML/Target/channel");
		if (chItem.getValue() != null)
					 channel=chItem.getOptions()[chItem.getValue()].value.split(':')[1];		//	var channel_id=channel.split(',')[0];//alert("ch:"+channel_id);			 

	if (pubname.getValue() != null)
	{
		var	pub = pubname.getOptions()[pubname.getValue()].value;
		var site_name=pub.split(':')[1];
		if(site_name == "ENR")
			path="xml/ENR/";
		else
			path="xml/RegionalPubs/"+site_name+"/";
			if (channel != null)
			{	
				 path=path+channel+"/";
				 var subchannel=IWDatacapture.getItem("/K4GenericXML/Target/subchannel1");
				 if ((subchannel.getValue() != null) && (subchannel.getValue() != undefined))
				{
					var subch=subchannel.getOptions()[subchannel.getValue()].value;
					if(subch.length !=0)
					{
					 	path=path+subch.split(':')[1]+"/";				 
					}
				}
			}	 
		 	 
   	 		var pub_date=IWDatacapture.getItem("/K4GenericXML/Body/pubdate").getValue();
  	 		var date=pub_date.split(' ')[0].split('-');
			path=path+date[0]+"/";
	}
	path = path.replace(/\s/g,'');
	relPath=path;
	//alert("relpath:"+relPath);
}


function create_relpaths(nextfun)
{
	IWDatacapture.displayMessage("Executing CMD Utility.. relative paths, Please wait ... ",1000);
	var params = new Object();
	params.cmd="mkdir";
	params.path1="y:/default/main/McGrawHill/MHC/ENR/WORKAREA/Content/templatedata/ENR-Articles/Article/data/"+relPath;
	params.path2="y:/default/main/McGrawHill/MHC/ENR/WORKAREA/Content/"+relPath;
	params.nextfun=nextfun;
	params.user=IWDatacapture.getUser();
	execute_cmd(params);
}


function execute_cmd(params)
{
	IWDatacapture.callServer("http://"+window.location.hostname+"/iw-bin/custom/common/execute_cmd.ipl",params,true);
}


function setTeaserValue()
{
	var teaservalue = IWDatacapture.getItem("/K4GenericXML/Body/teaser").getValue();
		if(teaservalue == "")
		{
		   var bodyvalue = IWDatacapture.getItem("/K4GenericXML/Body/body").getValue();
		    bodyvalue.match(/(.*?)<p>(.*?)<\/p>(.*)/);
			var paravalue = RegExp.$2;
		    IWDatacapture.getItem("/K4GenericXML/Body/teaser").setValue(paravalue);	    
		}
}

///Gmap Return function
function updateGmapFields(address,latitude,longitude,street,city,state,country,zip)
{
//	alert("address:"+address);
//	alert("gmap:"+gmapItem);
	var ord=IWDatacapture.getItem(gmapItem).getName().match(/\[\d+\]/); 
	IWDatacapture.getItem("/K4GenericXML/Target/locationgroup"+ord+"/Address").setValue(address);
	IWDatacapture.getItem("/K4GenericXML/Target/locationgroup"+ord+"/Latitude").setValue(latitude);
	IWDatacapture.getItem("/K4GenericXML/Target/locationgroup"+ord+"/Longitude").setValue(longitude);
	IWDatacapture.getItem("/K4GenericXML/Target/locationgroup"+ord+"/Street").setValue(street);
	IWDatacapture.getItem("/K4GenericXML/Target/locationgroup"+ord+"/City").setValue(city);
	IWDatacapture.getItem("/K4GenericXML/Target/locationgroup"+ord+"/State").setValue(state);
	IWDatacapture.getItem("/K4GenericXML/Target/locationgroup"+ord+"/Country").setValue(country);
	IWDatacapture.getItem("/K4GenericXML/Target/locationgroup"+ord+"/Zip").setValue(zip);


}

function onCalloutAddress(item)
{
	//alert(item.getName());
	gmapItem=item.getName();
	return true;
}

//Destinations

var next_replicant=1; // to remove
function populateDestWrapper()
{
	var nextfun=null;
	if(!isNew())
	{
		var destinations=IWDatacapture.getItem("/K4GenericXML/Target/destinations").getChildren();
		next_replicant=1;
		if(destinations.length > 0)
		{
				var toset="/K4GenericXML/Target/destinations["+next_replicant+"]/site";
				nextfun="populate_siteDB_callback('"+toset+"');";
				var item=IWDatacapture.getItem(toset);
				var site="";
				if (item.getValue() != null)
					site = item.getOptions()[item.getValue()].value;
				var site_id=site.split(':')[0]; 
				populate_sitesDB(nextfun,site_id,toset);
		}
	}	
}

function populate_siteDB_callback(sitePath)
{
	var item=IWDatacapture.getItem(sitePath);
    var ord=item.getName().match(/\[\d+\]/);
	var site="";
	if (item.getValue() != null)
		site = item.getOptions()[item.getValue()].value;
	var site_id=site.split(':')[0];
	var toset="/K4GenericXML/Target/destinations"+ord+"/channel";
	var nextfun="populate_channelsDB_dest_callback('"+toset+"');";
	//for channel
	item=IWDatacapture.getItem(toset);
	var channel="";
		if (item.getValue() != null)
			channel = item.getOptions()[item.getValue()].value;
		var channel_id=channel.split(':')[0];
		populate_channelsDB(nextfun,channel_id,site_id,toset);
}

function populate_channelsDB_dest_callback(channelPath)
{
	var item=IWDatacapture.getItem(channelPath);
    var ord=item.getName().match(/\[\d+\]/);

	var itemSite=IWDatacapture.getItem("/K4GenericXML/Target/destinations"+ord+"/site");
	var site="";var site_id=null;
	if (itemSite.getValue() != null)
	{
		site = itemSite.getOptions()[itemSite.getValue()].value;
		site_name=site.split(':')[1];
	}

	if(site_name=="ENR")
	{
		var channel="";var channel_id=null;
		if (item.getValue() != null)
		{
			channel = item.getOptions()[item.getValue()].value;
			channel_id=channel.split(':')[0];
		}
		IWDatacapture.getItem("/K4GenericXML/Target/destinations"+ord+"/subchannel").setVisible(true);
		var toset="/K4GenericXML/Target/destinations"+ord+"/subchannel";
		var nextfun="populate_subchannelsDB_dest_callback('"+toset+"');";
		//for subchannel
		item=IWDatacapture.getItem(toset);
		var subchannel="";
			if (item.getValue() != null)
				subchannel = item.getOptions()[item.getValue()].value;
			var subchannel_id=subchannel.split(':')[0];
			populate_subchannelsDB(nextfun,subchannel_id,channel_id,toset);
	}
	else
	{
		IWDatacapture.getItem("/K4GenericXML/Target/destinations"+ord+"/subchannel").setVisible(false);
		var destinations=IWDatacapture.getItem("/K4GenericXML/Target/destinations").getChildren();
		if(destinations.length > 0 )
		{
			if(next_replicant < destinations.length)
			{
				next_replicant=next_replicant+1
				var toset="/K4GenericXML/Target/destinations["+next_replicant+"]/site";
					nextfun="populate_siteDB_callback('"+toset+"');";
					var item=IWDatacapture.getItem(toset);
					var site="";var site_id=null;
					if (item.getValue() != null)
					{
						site = item.getOptions()[item.getValue()].value;
						site_id=site.split(':')[0]; 
					}
					populate_sitesDB(nextfun,site_id,toset);
			}
			else
			{//equal - do nothing
			}
		}
	}
}

function populate_subchannelsDB_dest_callback(subChannelPath)
{
	var destinations=IWDatacapture.getItem("/K4GenericXML/Target/destinations").getChildren();
	var item=IWDatacapture.getItem(subChannelPath);
    var ord=item.getName().match(/\[\d+\]/);
	if(destinations.length > 0 )
	{
		if(next_replicant < destinations.length)
		{
			next_replicant=next_replicant+1
			var toset="/K4GenericXML/Target/destinations["+next_replicant+"]/site";
				nextfun="populate_siteDB_callback('"+toset+"');";
				var item=IWDatacapture.getItem(toset);
				var site="";var site_id=null;
				if (item.getValue() != null)
				{
					site = item.getOptions()[item.getValue()].value;
					site_id=site.split(':')[0]; 
				}
				populate_sitesDB(nextfun,site_id,toset);
		}
		else
		{//equal - do nothing
		}

	}

}


function onRepAddDestinations(item)
{
	var sItem=item.getName()+"/site";
	populate_sitesDB(null,null,sItem);
	return true;
}

function onChangeSite(item)
{  
    var ord=item.getName().match(/\[\d+\]/); 
	
	var site="";
	if (item.getValue() != null)
		site = item.getOptions()[item.getValue()].value;
	var site_id=site.split(':')[0];
	var site_name=site.split(':')[1];
	if(site_name=="ENR")
	{
		IWDatacapture.getItem("/K4GenericXML/Target/destinations"+ord+"/subchannel").setVisible(true);
	}
	else
	{
		IWDatacapture.getItem("/K4GenericXML/Target/destinations"+ord+"/subchannel").setVisible(false);
	}

	var toset="/K4GenericXML/Target/destinations"+ord+"/channel";
		populate_channelsDB(null,null,site_id,toset);
}

function onChangeDestChannel(item)
{
	var channel="";
	var ord=item.getName().match(/\[\d+\]/);
	if (item.getValue() != null)
	{
		var site="";
		var siteitem=IWDatacapture.getItem("/K4GenericXML/Target/destinations"+ord+"/site");
		var site_name="";
		if (siteitem.getValue() != null)
		{
			site = siteitem.getOptions()[siteitem.getValue()].value;
			site_name=site.split(':')[1];
		}		
		if(site_name=="ENR")
		{
			channel = item.getOptions()[item.getValue()].value;
			var toset="/K4GenericXML/Target/destinations"+ord+"/subchannel";		
			var channel_id=channel.split(':')[0];
				populate_subchannelsDB(null,null,channel_id,toset);			
		}
		else
		{

		}
	
	}
}


//DB calling functions
function populate_sitesDB(nextfun,option,toset)
{
	//alert("in site_db");
	var params = new Object();
		params.toset = toset;//"/K4GenericXML/Target/pubname";
		params.sps ="sps_constr_media_get_sites(?,?)";
		params.select="true";
		params.nextfun=nextfun;
		params.option=option;
		params.cols="site_id,name,display_name";
		params.num='2';
		displayCSMsg("Populating Publications...",1000,"start");
		getOptionTags_DB(params);
		displayCSMsg("Populating Publications... Done",5000,"end");
}


function populate_originDB(nextfun,option,site_id,toset)
{
	//alert("in origin_db");
	var params = new Object();
		params.toset = toset;
		params.sps ="sps_constr_media_get_site_content_source(?,?,?)";
		params.select="true";
		params.nextfun=nextfun;
		params.search=site_id;
		params.option=option;
		params.cols="source_id,name";
		params.num='3';
		displayCSMsg("Populating Origins...",1000,"start");
		getOptionTags_DB(params);
		displayCSMsg("Populating Origins... Done",5000,"end");
}



function populate_channelsDB(nextfun,option,site_id,toset)
{
	//alert("in channel_db: option,site_id"+option+","+site_id);
	
	var params = new Object();
		params.toset = toset;//"/K4GenericXML/Target/channel";
		params.sps ="sps_constr_media_get_site_channels(?,?,?)";
		params.select="true";
		params.nextfun=nextfun;
		params.search=site_id;
		params.option=option;
		params.cols="channel_id,directory,name";
		params.num='3';
		displayCSMsg("Populating Channels...",1000,"start");
		getOptionTags_DB(params);
		displayCSMsg("Populating Channels... Done",5000,"end");
}


function populate_subchannelsDB(nextfun,option,channel_id,toset)
{
//	alert("in subchannel_db:");
	var params = new Object();
		params.toset = toset;//"/K4GenericXML/Target/subchannel1";
		params.sps ="sps_constr_media_get_site_subchannels(?,?,?)";
		params.select="true";
		params.nextfun=nextfun;
		params.search=channel_id;
		params.option=option;
		params.cols="subchannel_id,directory,name";
		params.num='3';
		displayCSMsg("Populating Sub Channels...",1000,"start");
		getOptionTags_DB(params);
		displayCSMsg("Populating Sub Channels... Done",5000,"end");
}

function populate_channels_attDB(nextfun,option,channel_id,toset)
{
	    //alert("in populate_channels_attDB");
		var params = new Object();
		params.toset = toset;
		params.sps ="sps_constr_media_get_site_channel_att(?,?,?)";
		params.select="true";
		params.nextfun=nextfun;
		params.search=channel_id;
		params.option=option;
		params.cols="attribute_id,name";
		params.num='3';
		displayCSMsg("Populating ChannelAttributes...",1000,"start");
		getOptionTags_DB(params);
		displayCSMsg("Populating ChannelAttributes... Done",5000,"end");
}

function populate_subchannels_attDB(nextfun,option,subchannel_id,toset)
{
	    //alert("in populate_subchannels_attDB");
		var params = new Object();
		params.toset = toset;
		params.sps ="sps_constr_media_get_site_subchannel_att(?,?,?)";
		params.select="true";
		params.nextfun=nextfun;
		params.search=subchannel_id;
		params.option=option;
		params.cols="attribute_id,name";
		params.num='3';
		displayCSMsg("Populating SubChannelAttribute...",1000,"start");
		getOptionTags_DB(params);
		displayCSMsg("Populating SubChannelAttribute... Done",5000,"end");
}


function populate_editionsDB(nextfun,option,toset)
{
	//alert("in editions_db");
	var params = new Object();
		params.toset = toset;//"/K4GenericXML/Target/channel";
		params.sps ="sps_constr_media_get_sites(?,?)";
		params.select="true";
		params.nextfun=nextfun;
		params.search=null;
		params.option=option;
		params.cols="site_id,name,display_name";
		params.num='2';
		displayCSMsg("Populating Editions...",1000,"start");
		getOptionTags_DB(params);
		displayCSMsg("Populating Editions... Done",5000,"end");
}


function getOptionTags_DB(params)
{
		IWDatacapture.callServer("http://"+window.location.hostname+"/iw-cc/mgh/common/getOptionTags_DB_SPS.jsp",params,false);				
}


//

function onChangeContentType(item)
{
	var ct="";
	if (item.getValue() != null)
		ct = item.getOptions()[item.getValue()].value;

	var price=IWDatacapture.getItem("/K4GenericXML/System MetaData/subscription/price");
	if(ct == 12)
	{
		price.setVisible(true);
	}
	else
	{
		price.setVisible(false);
		price.setValue("0");
	}
}



function show_hide_video()
{
	var medias= IWDatacapture.getItem("/K4GenericXML/Media/media").getChildren();	
	for(i=0;i<medias.length;i++)
		{
			j=i+1;
			var item=IWDatacapture.getItem("/K4GenericXML/Media/media["+ j +"]/mediatype");	
			onChangeMediaType(item);		
		}
}


function getOffsetDate(date,days_offset) 
{
  var yr  = parseInt(date.substring(0,4),10); 
  var mon = parseInt(date.substring(5,8),10); 
  var dd  = parseInt(date.substring(8,10),10); 
  var tDate = new Date(yr, mon-1, dd); 
  var date_offset=new Date(tDate.getTime() + days_offset*24*60*60*1000);
  var temp_dd = date_offset.getDate();
  if(temp_dd<10)
  {
	temp_dd="0"+temp_dd;
  }

  var temp_month = date_offset.getMonth();
  temp_month = temp_month+ 1;
  if(temp_month<10)
	{
		temp_month="0"+temp_month;
	}  
  var new_date= date_offset.getFullYear()+'-' + temp_month + '-'+ temp_dd;
  return new_date;
}



//This is function is to know the special characters equivalents in query strings.
function test()
{
var queryComponent = "country[@label='United States']";
//alert(encodeURIComponent(queryComponent)); // shows "Printing%20%26% 20Stationery"
}

