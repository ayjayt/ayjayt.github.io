echo -en '
#version {
	content: "'"$(git describe --always)"' + 1";
	color: #F3F3F3;
	position: absolute;
	top: 2px;
	left: 2px;
}' > css/version.css
