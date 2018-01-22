
function OnWebTwainNotFoundOnWindowsCallback(ProductName, InstallerUrl, bHTML5, bIE, bSafari, bSSL, strIEVersion) {
	var objUrl={'default':InstallerUrl};
	
	_show_install_dialog(ProductName, objUrl, bHTML5, EnumDWT_PlatformType.enumWindow, bIE, bSafari, bSSL, strIEVersion);
}

function OnWebTwainNotFoundOnLinuxCallback(ProductName, strDebUrl, strRpmUrl, bHTML5, bIE, bSafari, bSSL, strIEVersion) {
	var objUrl={'default':strDebUrl, 'deb':strDebUrl, 'rpm':strRpmUrl};
	
	_show_install_dialog(ProductName, objUrl, bHTML5, EnumDWT_PlatformType.enumLinux, bIE, bSafari, bSSL, strIEVersion);
}

function OnWebTwainNotFoundOnMacCallback(ProductName, InstallerUrl, bHTML5, bIE, bSafari, bSSL, strIEVersion) {

	var objUrl={'default':InstallerUrl};
		
	_show_install_dialog(ProductName, objUrl, bHTML5, EnumDWT_PlatformType.enumMac, bIE, bSafari, bSSL, strIEVersion);
}

function dwt_change_install_url(url)
{
	var install=document.getElementById('dwt-btn-install');
	if(install)
		install.href = url;
}

function _show_install_dialog(ProductName, objInstallerUrl, bHTML5, iPlatform, bIE, bSafari, bSSL, strIEVersion){
	
	var _height = 220, ObjString = [
			'<div class="dwt-box-title">',
			ProductName,
			' is not installed</div>'];
	
	
	if (bHTML5 && iPlatform == EnumDWT_PlatformType.enumLinux)
	{
		ObjString.push('<div style="margin:10px 0 0 5px;"><div id="dwt-install-url-div"><div><input id="dwt-install-url-deb" name="dwt-install-url" type="radio" onclick="dwt_change_install_url(\'' + objInstallerUrl['deb'] + '\')" checked="checked" /><label for="dwt-install-url-deb">64 bit .deb (For Ubuntu/Debian)</label></div>');
		ObjString.push('<div><input id="dwt-install-url-rpm" name="dwt-install-url" type="radio" onclick="dwt_change_install_url(\'' + objInstallerUrl['rpm'] + '\')" /><label for="dwt-install-url-rpm">64 bit .rpm (For Fedora)</label></div></div></div>');
	}
	else
	{
		ObjString.push('<div style="margin-top:20px;"></div>');
	}
	
	ObjString.push('<div style="margin:0 20px 20px 20px;text-align:center">');
	ObjString.push('<a id="dwt-btn-install" target="_blank" href="');
	ObjString.push(objInstallerUrl['default']);
	ObjString.push('" onclick="Dynamsoft_OnClickInstallButton()"><div class="dwt-button"></div></a>');
	ObjString.push('<i>* Please manually install it</i></div>');

	if(bHTML5){

		if(bIE){
			_height = 260;
			
			ObjString.push('<div>');
			ObjString.push('If you still see the dialog after installing the scan plugin, please<br />');
			ObjString.push('1. Add the website to the zone of trusted sites.<br />');
			ObjString.push('IE | Tools | Internet Options | Security | Trusted Sites.<br />');
			ObjString.push('2. refresh your browser.');
			ObjString.push('</div>');
			
		} else {
			_height = 270;

			if(iPlatform == EnumDWT_PlatformType.enumMac && bSafari && bSSL) {
				//
			} else {
			    ObjString.push('<div>');
			    ObjString.push('If you still see the dialog after the installation,<br />');
			    ObjString.push('please check <a href="http://developer.dynamsoft.com/dwt/why-is-the-browser-prompting-me-to-install-the-scanning-service-repeatedly ">this article</a> for troubleshooting.');
			    ObjString.push('</div>');
			}
			
			if (iPlatform == EnumDWT_PlatformType.enumLinux 
				|| navigator.userAgent.toLowerCase().indexOf("firefox") > -1) 
			{
			    ObjString.push('<div class="dwt-red" style="padding-top: 10px;">After installation, please RESTART your browser.</div>');
            } 
            else
			{
				ObjString.push('<div style="padding-top: 10px;">After installation, please REFRESH your browser.</div>');
			}
		}

	} else {
		if(bIE){
			ObjString.push('<div>');
			ObjString.push('After the installation, please<br />');
			ObjString.push('1. refresh the browser<br />');
			ObjString.push('2. allow "DynamicWebTWAIN" add-on to run by right clicking on the Information Bar in the browser.');
			ObjString.push('</div>');
			_height = 260;
		} else {
			ObjString.push('<p class="dwt-red" style="padding-top: 10px;">After installation, please REFRESH your browser.</p>');
		}
	}
	
	Dynamsoft.WebTwainEnv.ShowDialog(392, _height, ObjString.join(''));
}

function OnWebTwainOldPluginNotAllowedCallback(ProductName) {
    var ObjString = [
		'<div class="dwt-box-title">',
		ProductName,
		' plugin is not allowed to run on this site.</div>',
		'<ul>',
		'<li>Please click "<b>Always run on this site</b>" for the prompt "',
		ProductName,
		' Plugin needs your permission to run", then <a href="javascript:void(0);" style="color:blue" class="ClosetblCanNotScan">close</a> this dialog OR refresh/restart the browser and try again.</li>',
		'</ul>'];

	Dynamsoft.WebTwainEnv.ShowDialog(392, 227, ObjString.join(''));
}

function OnWebTwainNeedUpgradeCallback(ProductName, objInstallerUrl, bHTML5, iPlatform, bIE, bSafari, bSSL, strIEVersion){
	var ObjString = ['<div class="dwt-box-title"></div>',
		'<div style="font-size: 15px;">',
		'This page is using a newer version of Dynamic Web TWAIN than your local copy. Please download and upgrade now.',
		'</div>'], _height = 220;

	if (bHTML5 && iPlatform == EnumDWT_PlatformType.enumLinux)
	{
		ObjString.push('<div style="margin:10px 0 0 5px;"><div id="dwt-install-url-div"><div><input id="dwt-install-url-deb" name="dwt-install-url" type="radio" onclick="dwt_change_install_url(\'' + objInstallerUrl['deb'] + '\')" checked="checked" /><label for="dwt-install-url-deb">64 bit .deb (For Ubuntu/Debian)</label></div>');
		ObjString.push('<div><input id="dwt-install-url-rpm" name="dwt-install-url" type="radio" onclick="dwt_change_install_url(\'' + objInstallerUrl['rpm'] + '\')" /><label for="dwt-install-url-rpm">64 bit .rpm (For Fedora)</label></div></div></div>');
		_height = 260;
	}
	else
	{
		ObjString.push('<div style="margin-top:20px;"></div>');
	}	
		
	ObjString.push('<a id="dwt-btn-install" target="_blank" href="');
	ObjString.push(objInstallerUrl['default']);
	ObjString.push('" onclick="Dynamsoft_OnClickInstallButton()"><div class="dwt-button"></div></a>');
	ObjString.push('<div style="text-align:center"><i>* Please manually install it</i></div>');
	ObjString.push('<p></p>');
	
	if(bHTML5){
		
		var ua = navigator.userAgent.toLowerCase(),
			_bFirefox = ua.indexOf('firefox')>=0,
			strRefreshOrRestart;
		
		if(_bFirefox)
			strRefreshOrRestart = 'RESTART';
		else
			strRefreshOrRestart = 'REFRESH';

		
		ObjString.push('<div class="dwt-red">Please ' + strRefreshOrRestart + ' your browser after the upgrade.</div>');	
	} else {
		
		if(bIE){
			_height = 240;
			ObjString.push('<div class="dwt-red">');
			ObjString.push('Please EXIT Internet Explorer before you install the new version.');
			ObjString.push('</div>');
		}
		else
		{
		    ObjString.push('<div class="dwt-red">Please RESTART your browser after the upgrade.</div>');	
		}
	}

	Dynamsoft.WebTwainEnv.ShowDialog(392, _height, ObjString.join(''));
}

function OnWebTwainPreExecuteCallback(){
	Dynamsoft.WebTwainEnv.OnWebTwainPreExecute();
}

function OnWebTwainPostExecuteCallback(){
	Dynamsoft.WebTwainEnv.OnWebTwainPostExecute();
}

function OnRemoteWebTwainNotFoundCallback(ProductName, ip, port, bSSL)
{
	var ObjString = [
		'<div class="dwt-box-title">',
		ProductName,
		'</div>',
		'<div style="margin-top:10px">',
		'Dynamic Web TWAIN is not installed on the PC with IP/domain ',
		ip, ', please open the page on that PC to download and install it.',
		'</div>'];

	Dynamsoft.WebTwainEnv.ShowDialog(392, 227, ObjString.join(''));
}

function OnRemoteWebTwainNeedUpgradeCallback(ProductName, ip, port, bSSL)
{
	var ObjString = [
		'<div class="dwt-box-title">',
		ProductName,
		'</div>',
		'<div style="margin-top:10px">',
		'Dynamic Web TWAIN is outdated on the PC with IP/domain ',
		ip, ', please open the page on that PC to download and install it.',
		'</div>'];

	Dynamsoft.WebTwainEnv.ShowDialog(392, 227, ObjString.join(''));
}
