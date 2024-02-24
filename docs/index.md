---
layout: page
title: redirecting
---

<script>

try {
	switch (navigator.language.toLowerCase()) {
		case 'zh-cn':
			location.replace("/zh-CN/");
			break;
		default:
			location.replace("/en/");
	}
} catch (e) {
}

</script>
