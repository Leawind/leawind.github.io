/**
 * 在此页面中执行即可获取
 * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
function getAll() {
	let m = {};
	document.querySelectorAll(`.table-container>table>tbody>tr`).forEach(tr => {
		let t = tr.innerText.split('\t');
		for (let ext of t[0].split(' ')) {
			m[ext] = {
				mime: t[2],
				name: t[1],
			};
		}
	});
	console.log(m);
}
function ext2mime(fname) {
	return ext2type(fname).mime;
}
function ext2type(fname) {
	let ext = fname.split(".");
	ext = '.' + ext[ext.length - 1].trim();
	return MIME_MAP[ext] || {
		mime: "application/octet-stream",
		name: "unknown type"
	};
}
function ext2name(fname) {
	return ext2type(fname).name;

}


const MIME_MAP = {
	".aac": {
		"mime": "audio/aac",
		"name": "AAC audio"
	},
	".abw": {
		"mime": "application/x-abiword",
		"name": "AbiWord document"
	},
	".arc": {
		"mime": "application/x-freearc",
		"name": "Archive document (multiple files embedded)"
	},
	".avi": {
		"mime": "video/x-msvideo",
		"name": "AVI: Audio Video Interleave"
	},
	".azw": {
		"mime": "application/vnd.amazon.ebook",
		"name": "Amazon Kindle eBook format"
	},
	".bin": {
		"mime": "application/octet-stream",
		"name": "Any kind of binary data"
	},
	".bmp": {
		"mime": "image/bmp",
		"name": "Windows OS/2 Bitmap Graphics"
	},
	".bz": {
		"mime": "application/x-bzip",
		"name": "BZip archive"
	},
	".bz2": {
		"mime": "application/x-bzip2",
		"name": "BZip2 archive"
	},
	".csh": {
		"mime": "application/x-csh",
		"name": "C-Shell script"
	},
	".css": {
		"mime": "text/css",
		"name": "Cascading Style Sheets (CSS)"
	},
	".csv": {
		"mime": "text/csv",
		"name": "Comma-separated values (CSV)"
	},
	".doc": {
		"mime": "application/msword",
		"name": "Microsoft Word"
	},
	".docx": {
		"mime": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"name": "Microsoft Word (OpenXML)"
	},
	".eot": {
		"mime": "application/vnd.ms-fontobject",
		"name": "MS Embedded OpenType fonts"
	},
	".epub": {
		"mime": "application/epub+zip",
		"name": "Electronic publication (EPUB)"
	},
	".gif": {
		"mime": "image/gif",
		"name": "Graphics Interchange Format (GIF)"
	},
	".htm": {
		"mime": "text/html",
		"name": "HyperText Markup Language (HTML)"
	},
	".html": {
		"mime": "text/html",
		"name": "HyperText Markup Language (HTML)"
	},
	".ico": {
		"mime": "image/vnd.microsoft.icon",
		"name": "Icon format"
	},
	".ics": {
		"mime": "text/calendar",
		"name": "iCalendar format"
	},
	".jar": {
		"mime": "application/java-archive",
		"name": "Java Archive (JAR)"
	},
	".jpeg": {
		"mime": "image/jpeg",
		"name": "JPEG images"
	},
	".jpg": {
		"mime": "image/jpeg",
		"name": "JPEG images"
	},
	".js": {
		"mime": "text/javascript",
		"name": "JavaScript"
	},
	".json": {
		"mime": "application/json",
		"name": "JSON format"
	},
	".jsonld": {
		"mime": "application/ld+json",
		"name": "JSON-LD format"
	},
	".mid": {
		"mime": "audio/midi audio/x-midi",
		"name": "Musical Instrument Digital Interface (MIDI)"
	},
	".midi": {
		"mime": "audio/midi audio/x-midi",
		"name": "Musical Instrument Digital Interface (MIDI)"
	},
	".mjs": {
		"mime": "text/javascript",
		"name": "JavaScript module"
	},
	".mp3": {
		"mime": "audio/mpeg",
		"name": "MP3 audio"
	},
	".mpeg": {
		"mime": "video/mpeg",
		"name": "MPEG Video"
	},
	".mpkg": {
		"mime": "application/vnd.apple.installer+xml",
		"name": "Apple Installer Package"
	},
	".odp": {
		"mime": "application/vnd.oasis.opendocument.presentation",
		"name": "OpenDocument presentation document"
	},
	".ods": {
		"mime": "application/vnd.oasis.opendocument.spreadsheet",
		"name": "OpenDocument spreadsheet document"
	},
	".odt": {
		"mime": "application/vnd.oasis.opendocument.text",
		"name": "OpenDocument text document"
	},
	".oga": {
		"mime": "audio/ogg",
		"name": "OGG audio"
	},
	".ogv": {
		"mime": "video/ogg",
		"name": "OGG video"
	},
	".ogx": {
		"mime": "application/ogg",
		"name": "OGG"
	},
	".otf": {
		"mime": "font/otf",
		"name": "OpenType font"
	},
	".png": {
		"mime": "image/png",
		"name": "Portable Network Graphics"
	},
	".pdf": {
		"mime": "application/pdf",
		"name": "Adobe Portable Document Format (PDF)"
	},
	".ppt": {
		"mime": "application/vnd.ms-powerpoint",
		"name": "Microsoft PowerPoint"
	},
	".pptx": {
		"mime": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
		"name": "Microsoft PowerPoint (OpenXML)"
	},
	".rar": {
		"mime": "application/x-rar-compressed",
		"name": "RAR archive"
	},
	".rtf": {
		"mime": "application/rtf",
		"name": "Rich Text Format (RTF)"
	},
	".sh": {
		"mime": "application/x-sh",
		"name": "Bourne shell script"
	},
	".svg": {
		"mime": "image/svg+xml",
		"name": "Scalable Vector Graphics (SVG)"
	},
	".swf": {
		"mime": "application/x-shockwave-flash",
		"name": "Small web format (SWF) or Adobe Flash document"
	},
	".tar": {
		"mime": "application/x-tar",
		"name": "Tape Archive (TAR)"
	},
	".tif": {
		"mime": "image/tiff",
		"name": "Tagged Image File Format (TIFF)"
	},
	".tiff": {
		"mime": "image/tiff",
		"name": "Tagged Image File Format (TIFF)"
	},
	".ttf": {
		"mime": "font/ttf",
		"name": "TrueType Font"
	},
	".txt": {
		"mime": "text/plain",
		"name": "Text, (generally ASCII or ISO 8859-n)"
	},
	".vsd": {
		"mime": "application/vnd.visio",
		"name": "Microsoft Visio"
	},
	".wav": {
		"mime": "audio/wav",
		"name": "Waveform Audio Format"
	},
	".weba": {
		"mime": "audio/webm",
		"name": "WEBM audio"
	},
	".webm": {
		"mime": "video/webm",
		"name": "WEBM video"
	},
	".webp": {
		"mime": "image/webp",
		"name": "WEBP image"
	},
	".woff": {
		"mime": "font/woff",
		"name": "Web Open Font Format (WOFF)"
	},
	".woff2": {
		"mime": "font/woff2",
		"name": "Web Open Font Format (WOFF)"
	},
	".xhtml": {
		"mime": "application/xhtml+xml",
		"name": "XHTML"
	},
	".xls": {
		"mime": "application/vnd.ms-excel",
		"name": "Microsoft Excel"
	},
	".xlsx": {
		"mime": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"name": "Microsoft Excel (OpenXML)"
	},
	".xml": {
		"mime": "application/xml 代码对普通用户来说不可读 (RFC 3023, section 3) text/xml 代码对普通用户来说可读 (RFC 3023, section 3)",
		"name": "XML"
	},
	".xul": {
		"mime": "application/vnd.mozilla.xul+xml",
		"name": "XUL"
	},
	".zip": {
		"mime": "application/zip",
		"name": "ZIP archive"
	},
	".3gp": {
		"mime": "video/3gpp audio/3gpp（若不含视频）",
		"name": "3GPP audio/video container"
	},
	".3g2": {
		"mime": "video/3gpp2 audio/3gpp2（若不含视频）",
		"name": "3GPP2 audio/video container"
	},
	".7z": {
		"mime": "application/x-7z-compressed",
		"name": "7-zip archive"
	}
};

const mime = {
	ext2mime: ext2mime,
	ext2type: ext2type,
	ext2name: ext2name
};

export { mime };