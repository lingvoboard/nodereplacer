'use strict';


module.exports = {

	htmlclean: function (html)
	{


		/*
		* htmlclean
		* https://github.com/anseki/htmlclean
		*/
		/*
			1. Inline elements (HTML 4, XHTML 1.0 Frameset, XHTML 1.1)
			2. Elements in Phrasing content Category(HTML 5, HTML 5.1)
			empty:      Empty-Element
			altBlock:   Element that keeps inner contents
			embed:      The line-breaks will not be used for margins of this element
		*/
		const PHRASING_ELEMENTS = {
			a           : {},
			abbr        : {},
			acronym     : {},
			applet      : {
				altBlock: true,
				embed   : true
			},
			b           : {},
			bdo         : {},
			big         : {},
			br          : {
				empty   : true
			},
			button      : {
				altBlock: true
			},
			cite        : {},
			code        : {},
			del         : {},
			dfn         : {},
			em          : {},
			font        : {},
			i           : {},
			iframe      : {
				altBlock: true,
				embed   : true
			},
			img         : {
				empty   : true
			},
			input       : {
				empty   : true
			},
			ins         : {},
			isindex     : {
				empty   : true
			},
			kbd         : {},
			label       : {},
			object      : {
				altBlock: true,
				embed   : true
			},
			q           : {},
			s           : {},
			samp        : {},
			select      : {
				altBlock: true
			},
			small       : {},
			span        : {},
			strike      : {},
			strong      : {},
			sub         : {},
			sup         : {},
			textarea    : {},
			tt          : {},
			u           : {},
			var         : {},
			ruby        : {
				altBlock: true
			},
			audio       : {
				altBlock: true,
				embed   : true
			},
			bdi         : {},
			canvas      : {
				altBlock: true,
				embed   : true
			},
			data        : {},
			embed       : {
				empty   : true,
				embed   : true
			},
			keygen      : {
				empty   : true,
				embed   : true
			},
			mark        : {},
			meter       : {},
			output      : {},
			progress    : {},
			time        : {},
			video       : {
				altBlock: true,
				embed   : true
			},
			wbr         : {
				empty   : true
			},
			math        : {
				embed   : true
			},
			svg         : {
				altBlock: true,
				embed   : true
			},
			tspan       : {},
			tref        : {},
			altglyph    : {}
		};

		let embedElms,
			htmlWk = '',
			lastLeadSpace = '',
			lastTrailSpace = '',
			lastPhTags = '',
			lastIsEnd = true;

		if (typeof html !== 'string') {
			return '';
		}
		/*
			SSI tags
			<% ... %>         PHP, JSP, ASP/ASP.NET
			<?php ... ?>      PHP
			<?php ...         PHP
			<? ... ?>         PHP (confrict <?xml ... ?>)
			<jsp: ... >       JSP
			<asp:...>         ASP/ASP.NET (controls) ** IGNORE **
			<!--# ... -->     Apache SSI
		*/
		html = html
			// <% ... %>, <? ... ?>, <?php ... ?>, <?xml ... ?>
			.replace(/(?:<\s*([%?])[^]*?\1\s*>)/g, '')
			// <jsp: ... >
			.replace(/(<\s*jsp\s*:[^>]*>)/gi, '')
			// <!--# ... -->
			.replace(/(<\s*!\s*--\s*#[^]*?--\s*>)/g, '') //;
			// IE conditional comments
			// The line-breaks will not be used for margins of these elements.
			/*
				<![if expression]>
				<!--[if expression]>
				<!--[if expression]>-->
				<!--[if expression]><!-->
			*/
			.replace(/(?:<\s*!\s*(?:--)?\s*\[\s*if\b[^>]*>(?:(?:<\s*!)?\s*--\s*>)?)/gi, '')
			/*
				<![endif]>
				<![endif]-->
				<!--<![endif]-->
			*/
			.replace(/(?:<\s*!\s*--\s*)?<\s*!\s*\[\s*endif\b[^>]*>/gi, '');

		// embed
		embedElms = Object.keys(PHRASING_ELEMENTS)
			.filter(function(tagName) {
				return PHRASING_ELEMENTS[tagName].embed;
			})
			.join('|'); // tagName is safe
		html = html.replace(
			new RegExp(
				'[\\x20\\f\\n\\r\\t\\v]*(<\\s*\\/?\\s*(?:' + embedElms + ')\\b[^>]*>)[\\x20\\f\\n\\r\\t\\v]*',
				'ig'
			),
			'$1'
		);

		// ==================================== REMOVE

		// The [\n\r\t ] may be used for separator of the words or for margins of the elements.
		html = html
			.replace(/[\x20\f\n\r\t\v]+/g, ' ') // \s includes many others
			.trim();

		// Whitespaces between HTML tags
		html = html
			.replace(/( *)([^]*?)( *)(< *(\/)? *([^ >\/]+)[^>]*>)/g, function(
				str,
				leadSpace,
				text,
				trailSpace,
				tag,
				isEnd,
				tagName
			) {
				tagName = tagName.toLowerCase();
				if (tagName === 'br' || tagName === 'wbr') {
					// Break
					htmlWk +=
						(text
							? lastIsEnd
								? lastPhTags + (lastTrailSpace || leadSpace) + text
								: (lastLeadSpace || leadSpace) + lastPhTags + text
							: lastPhTags) + tag;
					lastLeadSpace = lastTrailSpace = lastPhTags = '';
					lastIsEnd = true;
				} else if (PHRASING_ELEMENTS[tagName]) {
					if (PHRASING_ELEMENTS[tagName].altBlock) {
						// Break
						if (isEnd) {
							htmlWk +=
								(text
									? lastIsEnd
										? lastPhTags + (lastTrailSpace || leadSpace) + text
										: (lastLeadSpace || leadSpace) + lastPhTags + text
									: lastPhTags) + tag;
						} else {
							htmlWk +=
								(lastIsEnd
									? lastPhTags + (lastTrailSpace || leadSpace) + text
									: (lastLeadSpace || leadSpace) + lastPhTags + text) +
								(text ? trailSpace : '') +
								tag;
						}
						lastLeadSpace = lastTrailSpace = lastPhTags = '';
						lastIsEnd = true;
					} else if (PHRASING_ELEMENTS[tagName].empty) {
						// Break
						htmlWk +=
							(lastIsEnd
								? lastPhTags + (lastTrailSpace || leadSpace) + text
								: (lastLeadSpace || leadSpace) + lastPhTags + text) +
							(text ? trailSpace : '') +
							tag;
						lastLeadSpace = lastTrailSpace = lastPhTags = '';
						lastIsEnd = true;
					} else {
						if (isEnd) {
							if (text) {
								// Break
								htmlWk += lastIsEnd
									? lastPhTags + (lastTrailSpace || leadSpace) + text
									: (lastLeadSpace || leadSpace) + lastPhTags + text;
								lastLeadSpace = '';
								lastTrailSpace = trailSpace;
								lastPhTags = tag;
							} else {
								if (lastIsEnd) {
									lastTrailSpace = lastTrailSpace || leadSpace;
									lastPhTags += tag;
								} else {
									// Break
									htmlWk += lastPhTags;
									lastTrailSpace = lastLeadSpace || leadSpace;
									lastLeadSpace = '';
									lastPhTags = tag;
								}
							}
						} else {
							if (text) {
								// Break
								htmlWk += lastIsEnd
									? lastPhTags + (lastTrailSpace || leadSpace) + text
									: (lastLeadSpace || leadSpace) + lastPhTags + text;
								lastLeadSpace = trailSpace;
								lastTrailSpace = '';
								lastPhTags = tag;
							} else {
								if (lastIsEnd) {
									// Break
									htmlWk += lastPhTags;
									lastLeadSpace = lastTrailSpace || leadSpace;
									lastTrailSpace = '';
									lastPhTags = tag;
								} else {
									lastLeadSpace = lastLeadSpace || leadSpace;
									lastPhTags += tag;
								}
							}
						}
						lastIsEnd = isEnd;
					}
				} else {
					// Break
					htmlWk +=
						(text
							? lastIsEnd
								? lastPhTags + (lastTrailSpace || leadSpace) + text
								: (lastLeadSpace || leadSpace) + lastPhTags + text
							: lastPhTags) + tag;
					lastLeadSpace = lastTrailSpace = lastPhTags = '';
					lastIsEnd = true;
				}
				return '';
			})
			// Text after last tag (But, it's wrong HTML)
			.replace(/^( *)([^]*)$/, function(str, leadSpace, text) {
				htmlWk += text
					? lastIsEnd
						? lastPhTags + (lastTrailSpace || leadSpace) + text
						: (lastLeadSpace || leadSpace) + lastPhTags + text
					: lastPhTags;
				return '';
			});
		html = htmlWk;

		return html;
		
	}

};
