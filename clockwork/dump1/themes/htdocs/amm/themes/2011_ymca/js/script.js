/* Author: 

*/

WebFont.load({
  custom: {
    families: ['Cachet W02 Book','Cachet W02 Medium','Cachet W02 Bold','Pictos']
  }
});

jQuery(function(){


	jQuery('nav.primary > ul > li').each(function(i, el){
		if(i == 5) jQuery(this).addClass('last');
		if(i >= 6) jQuery(this).remove();
	})

	jQuery('.group-ex .location a').live('click', function(){
		var maplocation = jQuery(this).attr('href').match(/(-?\d+\.\d+)/g),
			locationtitle = jQuery(this).attr('href').match(/\((.*)\)/)[1],
			address = jQuery(this).attr('href').match(/q=(.*)\+(.*)\(/),
			latlng = new google.maps.LatLng(maplocation[0], maplocation[1]),
			myOptions = {
							zoom: 10,
							center: latlng,
							mapTypeId: google.maps.MapTypeId.ROADMAP
						},
			mapwindow = window.open('', 'map', 'width=500,height=350'),
			html =	'<html><head><title>View Location</title>'+
					'<link rel="stylesheet" type="text/css" href="/amm/themes/2011_ymca/css/style.css"></head>'+
					'<body style="height: 100%"><a target="_blank" style="position: absolute; right: 10px; z-index: 300; background: white; padding: 2px 3px; border-radius: 3px; bottom: 20px; font-weight: bold;" href="'+jQuery(this).attr('href')+'">View in Google Maps</a><div id="gmap"/></body></html>';
		mapwindow.document.write(html);
		jQuery(mapwindow.document).find('#gmap').height('100%').width('100%');
		var map = new google.maps.Map(jQuery(mapwindow.document).find('#gmap')[0], myOptions),
			marker = new google.maps.Marker({
		      position: latlng,
		      title: locationtitle
		 	}),
			info  =  new google.maps.InfoWindow({content:'<h3>'+locationtitle+'</h3><p>'+address[1]+'<br/>'+address[2]+'</p>'}).open(map, marker);
		marker.setMap(map);
		return false;
	});
	jQuery('.locations #subnav-utility, .camps #subnav-utility').each(function(){
		var picker = jQuery(innerShiv('<nav id="subnav-picker"><h4>Select another location</h4><select/></nav>'));
		var picker = jQuery(this).after(picker).next(picker);
		picker
			.find('select')
			.change(function(){
				document.location = jQuery(this).find(':selected').val();
			});
		jQuery(this).find('.level_2').children('a').each(function(){
			var selected = jQuery(this).parent().hasClass('active') ? 'selected': '';
			picker.find('select').append('<option value="'+jQuery(this).attr('href')+'" '+selected+' >'+jQuery(this).text()+'</option>');
		});
	});
	if(jQuery('#main.home').length > 0) jQuery('body').addClass('home');
	if(jQuery.browser.msie){
		jQuery('.home .promo, article.schedules, .module, #subnav-promos div.promos .promo, nav#subnav, nav#subnav-utility, #promos .promo').wrapInner('<div class="bg"/>');
		jQuery('.button a, nav.primary header, .button-blue a, nav.primary ul ul .active a, '+
				'.membership .utility .membership a, .locations .utility .locations a, .home .utility .home a,'+
				'.schedules__events .utility .schedules__events a, .about .utility .about a, '+
				'.contact .utility .contact a, .sign_in .utility .sign_in a, button').wrapInner('<span/>');
		jQuery('body > footer section li:last-child').addClass('last');
		jQuery('blockquote').prepend('<span class="quote">&ldquo;</span>')
		jQuery('.ie7 nav.primary a:contains(Health & Fitness)').width(112);
		jQuery('.ie7 body > footer section li:first-child').addClass('first');
		jQuery('.ie7 .breadcrumbs li:not(li:last)').append(	' >');
	}
	var d = new Date();
	// jQuery('#subnav-utility li.level_2.active, #subnav li.level_3.active').each(function(){
	// 		var result = jQuery(this).clone(),
	// 			parent = jQuery(this).parent('ul');
	// 		jQuery(this).removeClass('active current');
	// 		result.css('margin', '20px 0').prependTo(parent);
	// 	})
	jQuery('.ie7 nav.primary table.UL').wrap('<div class="table"/>')
	jQuery('.ie #slideshow').append('<span class="tl corner"/><span class="tr corner"/><span class="bl corner"/><span class="br corner"/><span class="overlay" />');
	jQuery('nav.primary > ul > li:not(li.active li)').each(function(i, el){
		var pic = jQuery(this).prepend('<span class="pic"/>').find('span.pic'),
			clone;
		if(jQuery.browser.msie) jQuery(this).addClass('child-'+(i+1));
		clone = pic
			.clone()
			.addClass('clone')
			.css('opacity', 0)
			.insertAfter(pic);
		jQuery(this).hover(function(){
			pic.show();
			clone.animate({
				opacity: 1
			},{
				queue: false,
				duration: 100,
				specialEasing: 'swing'
			});
		},
		function(){
			pic.show();
			clone.animate({
				opacity: 0
			},{
				queue: false,
				duration: 200,
				specialEasing: 'swing'
			});
		});
	});
	jQuery('.content_wrapper.schedules h2').append('<span class="cal">'+d.getDate()+'</span>');
	jQuery('#slideshow .text-link a:contains("Directions")').addClass('place');
	jQuery('#slideshow .text-link a:contains("Photo")').addClass('photo');
	jQuery('.ie #slideshow .text-link a').wrapInner('<span/>');
	jQuery('.group-ex.results table:nth-child(2n+1)').addClass('odd');
	jQuery('#slideshow .text-link a:contains("Gallery")').addClass('gallery');
	jQuery('article.schedules form').each(function(){
		if(jQuery(this).find('.filter').length <= 1){
			var form = jQuery(this);
			jQuery(this)
				.find('select').change(function()
				{
					form.submit();
				}
			);
			jQuery(this).find('button, label').hide();
		}
	})
	
	// CFInstall.check({
	// 			mode: 'overlay',
	// 			url: '//www.google.com/chromeframe?extra=devchannel&user=true'
	// 			});
	
})


function draw(graphic, target, targetWidth){
	target.each(function(){
		jQuery(this).html('');
		var paper = Raphael(this,1,1);
		var set = paper.set();
		jQuery(graphic).each(function(index,value){
			var attrs = Object();
			jQuery.each(this,function(i,val){
				if(i !='type' && i !='path'){
					attrs[i] = val;
				}
			});
			set.push(paper.path(this.path).attr(attrs));
		});
		var mult = targetWidth/set.getBBox().width;
		set.scale(mult,mult,0,0);
		paper.setSize(set.getBBox().width, set.getBBox().height);
	});
}


function myanimation(current, previous, event, ui, percentage){
	//CUSTOM ANIMATIONS
	
	/*	layer 2 will fade in and fade out,
		with a delay before and after with
		a quick fade-in and fade out. */
	
	/* tweaked percent for fade delays */	
	delay = .8
		inPercent = Math.max(0, (percentage-delay)*(1/(1-delay)));
		outPercent = Math.max(0, (1-(percentage+delay))*(1/(1-delay)));

	//Entering Slide
	current.find('.layer-0').css({
		backgroundPosition: percentage*250-250+'px 0px'
	});
	current.find('.layer-1').css({
		left: 0,
		overflow: 'hidden'
	}).children().css({
		position: 'relative',
		left: percentage*500-500
	});
	current.find('.layer-2').css({
		backgroundPosition: -(900-(percentage*900))+'px 0px',
		left: 0
	})
	current.find('.layer-2 .png-fix').css({
		left: -(900-(percentage*900)),
		position: 'absolute'
	});
	current.find('.layer-3').css({
		opacity: inPercent,
		left: -current.position().left
	});
	
	//tweak layering on landing, so link is clickable.
	if(percentage == 1){
		current.find('.layer-1')
			.css({
				'z-index': 10,
				height: 'auto'
				});
	}else{
		previous.find('.layer-1').css('z-index', 1)
		current.find('.layer-1').css('z-index', 1)
	}
	
	// Items leaving
	previous.find('.layer-1').children().css({
		position: 'relative',
		left: -percentage*100
	});
	
	previous.find('.layer-2').css({
		backgroundPosition: '50% 0px',
		left: 0
	});
	previous.find('.layer-2 .png-fix').css({
		right: -percentage*200,
		position: 'absolute',
		left: 'auto'
	});
	previous.find('.layer-3').css({
		opacity: outPercent
	});
	
	//PREVIOUS ITEM ANIMATION OVERRIDE
	

	// previous.find('.layer-2').css({
	// 	backgroundPosition: 450-percentage*600+'px 1px'
	// });	


}

// Parallax custom script

jQuery(function(){

	var curr = 0,
		direction = -1,
		max,
		animator,
		autoadvance,
		initialDelay = 3500;
	if(!readCookie('bubbleShown')){ 
		initialDelay = initialDelay + 500;
	}
	if(!jQuery('.slides').length) return;
	max = jQuery('.slides').length-1;
	setTimeout(function(){
		autoadvance = setInterval(function(){
			advance();
		}, 4500);
		advance();
	}, initialDelay);
	function advance(){
		direction  = (curr >= max || curr <= 0)? direction*-1:direction;
		curr = curr + direction;
		navigate(jQuery('.parallax'), curr);
	}		
	function navigate(container, ii){
			var curr, direction;
			container.find('.pager a').removeClass('active');
			container.find('.pager a').eq(curr).addClass('active');
			curr = container.find('.track').slider('value');
			direction = (50*ii - curr)/Math.abs(50*ii-curr);
			if(isNaN(direction)) direction = 0;
			clearTimeout(animator);
			go = function(){
				curr += direction*2;
				jQuery('.track').slider('value', curr);
				// console.log(direction);
				if((curr >= 50*ii && direction > 0) || (curr <= 50*ii && direction < 0)){
					clearTimeout(animator);
				}else{
					animator = setTimeout(go, 0);
				}
			};
			go();
	}
	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		createCookie(name,"",-1);
	}
	/* this is not a part of the parallax script, 
	but this makes the amm cleaner by just targeting
	slides and wrapping them */
	
	//return false;
	// jQuery('.home .slides')
	// 	.wrapAll(innerShiv('<section class="parallax"></section>'));
	jQuery(innerShiv('<section class="parallax"/>', false))
		.appendTo(jQuery('.home .slides').parent())
		.append(jQuery('.home .slides'));
/*	jQuery('.signed_in li.last a').click(function(){
		var logout = jQuery('<div/>').load(jQuery(this).attr('href')+' .member_logout_component', function(data){
			document.location = logout.find('a').attr('href');
		})
		return false;
	})
	jQuery('.sign_in a').click(function(){
		var login = jQuery('<div/>').load(jQuery(this).attr('href')+' .personify_sso_link', function(data){
			document.location = login.find('a').attr('href');
		})
		return false;
	}) */
	jQuery('.parallax')
		.each(function(i, slideshow){
			var slides,
				container = jQuery(this),
				custom = myanimation,
				maxheight = 0,
				lastvalue = 50,
				block = true,
				animator;
			// set up markup for jquery ui slider 
			jQuery(this)
				.append('<div class="slider"><div class="pager"/><div class="track"/></div>')
				.prependTo('#main')
				.children(':not(.slider)')
				// look for all immediate children of parallax excluding jquery ui slider, one pager per slide
				.each(function(ii, slide){
					var layers = jQuery(this).find('img, .richtext').length,
						slides;
					jQuery('<a>&bull;</a>')
						.appendTo(container.find('.pager'))
						.click(function(){
							clearInterval(autoadvance);
							navigate(container, ii);
						});
					
					// all slides have the same default styling
					jQuery(this)
						.addClass('slide slide-'+ii)
						.css({
							position: 'absolute',
							overflow: 'hidden',
							height: '100%'
						});
					
					// force all items but the first off the stage to the right
					if(ii > 0) jQuery(this).css('left', container.width());
					
					// build up layers with default styling and z-index
					jQuery(this).find('img, .richtext').each(function(iii, layer){
						var temp = jQuery('<div />').addClass('layer layer-'+iii).css({
								width: '100%',
								height: '100%',
								position: 'absolute',
								top: 0,
								zIndex: iii+1,
								backgroundRepeat: 'no-repeat'
								//left: container.width()/layers*iii
							}).appendTo(slide);
							if(ii <= 0) temp.css('left', 0);
						
						if(jQuery(this).html()!='') temp.html(jQuery(this).html());
						if(jQuery(this).is('img')){
							if(!jQuery.browser.msie || jQuery(this).attr('src').match(/(jpg|gif)$/i)){
								temp.css({backgroundImage: 'url('+jQuery(this).attr('src')+')'});
							}else{
								temp
									.css({
										height: '100%',
										width: '100%',
										overflow: 'hidden'
									})
									.append('<div class="png-fix"/>')
									.find('.png-fix')
									.css({
										filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader' + '(src=\'' + jQuery(this).attr('src') + '\', sizingMethod=\'crop\');',
										height: jQuery(this).height(),
										width: jQuery(this).width()
										})
							}
							jQuery('<img/>')
								.appendTo(container)
								.css('visibility', 'hidden')
								.css('position', 'absolute')
								.load(function(){
									maxheight = Math.max(maxheight, jQuery(this).height());
									container.height(maxheight);
									container.find('.slide').height(maxheight);
									jQuery(this).remove();
								})
								.attr('src', jQuery(this).attr('src'))
						}
					});
					
					jQuery(this).children().not('div.layer').remove();
				});
				
				slides = jQuery(this).find('.slide');
			
				jQuery(this)
					.find('.track')
					.css('z-index', jQuery('.slide').length+1)
					.slider({
						min: 0,
						animate: 100,
						max: 50*(slides.length-1),
						slide: function(event, ui){
							scrub(event, ui);
						},
						change: function(event, ui){
							scrub(event, ui);	
						},
						stop: function(event, ui){							
							block = false;
							container.css('cursor', 'default');
							jQuery('.parallax .ui-slider-handle').blur();
						}
					});
					jQuery('.track').mousedown(function(){
							clearInterval(autoadvance);
					});
				var test = setInterval(function(){
					var value = container.find('.track').slider('value'),
						next;
					if(lastvalue == value && !block){
						block = true;
						next = (value)/50;
						if(next - Math.floor(next) > .8 || next - Math.floor(next) < .2){
							container.find('.track').slider('option','animate', 300).slider('value', Math.round(next)*50);
						}
					}
					lastvalue = value;
				}, 100)
				container
					.find('.track')
					//.slider('value', 50*Math.floor(slides.length/2));
					.slider('value', 0)
				
				if(!readCookie('bubbleShown')){
					container
						.find('.ui-slider-handle')
						.append('<div class="bubble">Drag to Explore</div>')
						.find('.bubble')
						.css({
							left: '50%',
							position: 'absolute',
							display: 'block',
							marginLeft: -container.find('.bubble').outerWidth()/2,
							top: -container.find('.bubble').outerHeight()-5
						})
						.delay(2000)
						.fadeOut(1000);
					container.find('.ui-slider-handle')
						.mousedown(function(){
							jQuery(this)
								.find('.bubble')
								.fadeOut(300)						
							createCookie('bubbleShown', true);
						})
				}
				container.find('.pager a')
					.eq(Math.round(container.find('.track').slider('value'))*50)
					.addClass('active');
				container.css({cursor: 'default'});
				
				jQuery('.parallax').mousewheel(function(event, delta, deltaX, deltaY) {
					block = false;
					var val = jQuery('.parallax .track').slider('value')
					jQuery('.parallax .track').slider('value', val+deltaX*10)
					if(Math.abs(deltaX) > .05){
						event.preventDefault();	
						event.stopPropagation();
					} 
			   	});
				
				function scrub(event, ui){
					var increment,
						percentage = ((ui.value%50)/50 == 0)? 1:(ui.value%50)/50,
						curr = Math.ceil(ui.value/50),
						current = jQuery(slides[curr]),
						prev = ((curr-1) >= 0) ? curr-1 : slides.length-1;
						previous = ((curr-1) >= 0) ? jQuery(slides[curr-1]) :jQuery(slides[slides.length-1]),
						increment = container.width()/current.children().length*3;
					// console.log(ui.value);
					if(event.type == 'slide') container.css('cursor', 
						function(){
							if (jQuery.browser.mozilla) {
								return '-moz-grabbing';
							}else if (jQuery.browser.webkit) {
								return '-webkit-grabbing';
							}else {
								return 'move';
						}});
					
					// Reset all elements just in case
					
					current.css('overflow','visible');
					slides
						.not(':eq('+curr+')')
						.css('overflow', 'hidden')
						.not(':eq('+prev+')')
						.css({
							left  : container.width(),
							width : 0
							});
					previous.css('left', 0)
						.find('.layer')
						.css('left',0);
					current
						.width('100%')
						
					previous
						.width(container.width()-(container.width()*percentage))

					current.children().each(function(ii, el){
						var left = increment*ii - increment*ii*percentage;
						jQuery(this).css('left', left);
					});
					
					current.css('left', container.width()-(container.width()*percentage));
					
					container.find('.pager a')
						.removeClass('active')
						.eq(Math.round(ui.value/50))
						.addClass('active');
					
					custom(current, previous, event, ui, percentage);
				}		
		});	
});
jQuery(function(){
	if(jQuery('#main .top').length <= 0){
	var markers = [],
		pins = [],
		list = [],
		watcher,
		markerImage,
		markerShadow;
		var markerImage = new google.maps.MarkerImage('/amm/themes/2011_ymca/images/map-icon-center.png',
		      new google.maps.Size(32, 42),
		      new google.maps.Point(0,0),
		      new google.maps.Point(0, 42));
		  var markerShadow = new google.maps.MarkerImage('/amm/themes/2011_ymca/images/map-icon-center-shadow.png',
		      new google.maps.Size(49, 42),
		      new google.maps.Point(0,0),
		      new google.maps.Point(0, 42));
		if(jQuery('body.locations').length > 0){
			var alltypes = [],
				types;
			for(var i=locations.length; i--;){
				types = locations[i].types;
				if(typeof types != 'undefined'){
					for(ii=types.length; ii--;){
						if(jQuery.inArray(types[ii], alltypes)<0){
							alltypes.push(types[ii]);
						}
					}
				}
			}
			types = '';
			jQuery('#main .ctr').prepend(innerShiv('<figure id="map"><div class="container"/>'+
											'<form class="map search">'+
												'<h2>Find A YMCA Location</h2>'+
												'<label for="address">City or Zip Code</label><input id="address"/> '+
												'<select name="miles">'+
														'<option value="5">5 mi</option>'+
														'<option value="10">10 mi</option>'+
														'<option value="30">30 mi</option>'+
														'<option value="50">50 mi</option>'+
														'<option value="100">100 mi</option>'+
														'<option value="" selected>All</option>'+
												'</select>'+
												'<fieldset class="types"><legend>Type of Location</legend>'+
												'</fieldset>'+
												'<button type="submit">Find</button></form></figure>'));
			function getLocation() {
			  if (Modernizr.geolocation) {
				jQuery('form.map #address')
					.before('<a class="locateme" title="Locate Me">@<span>Locate Me</span></a>')
					.prev('.locateme').click(function(){
						jQuery('#address').val('');
					    watcher = navigator.geolocation.watchPosition(recenter);
					});
			  } else {
			    // no native support; maybe try Gears?
			  }
			}
			function recenter(position){
				var lat = position.coords.latitude,
					lng = position.coords.longitude,
					accuracy = position.coords.accuracy;
				// console.log(lat, lng, position);
				map.setCenter( new google.maps.LatLng( lat, lng ));
				map.setZoom(14);
				// accuracy = 100;
				if(accuracy <= 30){
					geocoder.geocode({'latLng': new google.maps.LatLng(lat,lng)}, function(results,status){
						if(results[0]) jQuery('form.map #address').val(results[0].formatted_address);
					})
					navigator.geolocation.clearWatch(watcher);
				}else{
					var dots = (function(){
						var array = [];
						for(var i=parseInt(accuracy/10); i--;){
							array.push('.');
						}
						return array.join('');
					})();
					jQuery('form.map #address').val('locating'+dots);
				}
				origin.setPosition(new google.maps.LatLng( lat, lng ));
			}
			function buildmap(locations){
				for(i=0; i<locations.length; i++){
					locations[i].content = '<h3>'+locations[i].name+'</h3>'+
										'<p>'+locations[i].street+'<br/>'+locations[i].city+', '+locations[i].state+'</p>'+
										'<p>'+locations[i].number+'</p>'+
										'<p><a href="'+locations[i].url+'">Visit Location Page</a></p>';
					pins[i] = new google.maps.LatLng( locations[i].lat, locations[i].lng );
					if ( center == null ) center  =  pins[i];
					markers[i]  = new google.maps.Marker( {
							//map: map,
							position: pins[i],
							title: locations[i].name,
							icon: locations[i].icon,
							shadow: locations[i].shadow,
							animation: google.maps.Animation.DROP
					} );
					if(list.length <= 0) markers[i].setMap(null);
					for(var ii=list.length; ii--;){
						if(jQuery.inArray(list[ii], locations[i].types) >=0){
							markers[i].setMap(map);
							break;
						} else{
							markers[i].setMap(null);
						}
					}
					//markers[i].setMap(map);
					with({content: locations[i].content, marker: markers[i],  types: locations[i].types}){	
						var sel = [];
						for(var ii=alltypes.length; ii--;){
							if(jQuery.inArray(alltypes[ii], types)>=0){
								sel.push('#content ul.locations.type-'+ii+'');
							}
						}
						sel = sel.join(', ');
						jQuery('<li>'+content+'</li>').click(function(){
							info.setContent(content);
							info.open( map, marker );
						}).appendTo(sel);
						
						google.maps.event.addListener( markers[i], 'click', function(point) {
								info.setContent(content);
								info.open( map, marker );
						} );
					}
					jQuery('ul.locations').each(function(){
						jQuery(this).find('li').each(function(ii, el){
							jQuery(this).addClass('col-'+ii%4);
						});
					});
				}
			}
		    var options  =  {
		      				zoom: 9,
					      	mapTypeId: google.maps.MapTypeId.ROADMAP
					    	},
				map  =  new google.maps.Map( jQuery( 'figure#map .container' ).get( 0 ), options ),
		        geocoder = new google.maps.Geocoder(),
				center  =  new google.maps.LatLng( 44.9773, -93.2733 ),
				origin  =  new google.maps.Marker( {
		        		position: center,
				        icon: markerImage,
						shadow: markerShadow,
						map: map
		    			}),
				bounds = new google.maps.LatLngBounds(),
				info  =  new google.maps.InfoWindow();
		

			jQuery('#content').append(innerShiv('<nav class="types"><ul/></nav>'));
		    map.setCenter(center);
			getLocation();
			for(var i=0; i < alltypes.length; i++){
				jQuery('nav.types').after('<ul class="locations type-'+i+'"/>');
				jQuery('fieldset.types').append('<label for="type-'+i+'"><input id="type-'+i+'" type="checkbox" value="'+alltypes[i]+'"/>'+alltypes[i]+'</label>');
				jQuery('#content nav.types ul').append('<li class="type-'+i+'"><a><span>'+alltypes[i]+'</span></a></li>');
			}
			list.push(jQuery('fieldset.types input').attr('checked','checked').val());
			buildmap(locations);	
			jQuery('nav.types li').click(function(){
				jQuery('nav.types li.active, ul.locations.active').removeClass('active');
				jQuery('ul.locations.'+jQuery(this).attr('class')).addClass('active');
				jQuery(this).addClass('active');
			});
			jQuery('nav.types li:first').each(function(){
				jQuery('ul.locations.'+jQuery(this).attr('class')).addClass('active');
				jQuery(this).addClass('active');
			});
			jQuery('form.map.search').submit(function(){
				var miles = jQuery('select[name="miles"] option:selected').val() || 10000;
				var address = jQuery(this).find('#address').val();
				address = address.match(/MN/)?address:address+', MN';
				origin.setAnimation(null);
				origin.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function(){
					origin.setAnimation(null);
				}, 800);
		     	geocoder.geocode({'address':address}, function(results, status) {
					if(status == 'OK' || typeof origin != 'undefined'){
							var position,
								bounds = new google.maps.LatLngBounds();
							if(status == 'OK'){
								position = results[0].geometry.location;
								bounds.extend(results[0].geometry.location);
								origin.setPosition(position);
							}else{
								position = origin.getPosition();
							}
							bounds.extend(position)
							var maplocs = false;
							for(var i=locations.length; i--;){
								var R = 6371,
									lat1 = parseFloat(position.lat()),
									lon1 = parseFloat(position.lng()),
									lat2 = parseFloat(locations[i].lat),
									lon2 = parseFloat(locations[i].lng);
								var dLat = (lat2-lat1).toRad();
								var dLon = (lon2-lon1).toRad();
								var lat1 = lat1.toRad();
								var lat2 = lat2.toRad();
								var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
								var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
								var d = R * c;
								for(var ii=list.length; ii--;){
									if(jQuery.inArray(list[ii], locations[i].types) >=0 && d < miles){
										markers[i].setMap(map);
										//markers[i].setAnimation(google.maps.Animation.DROP);
										bounds.extend(pins[i]);
										maplocs = true;
										break;
									} else{
										markers[i].setMap(null);
										//markers[i].setAnimation(null);
									}
								}
							}
							if(!maplocs){
								alert('We\'re sorry, no locations were found in your area');
							}else{
								map.fitBounds(bounds);
							};
				     }else{
							alert('We\'re sorry, "'+address + '" was not found');
					}
		     	});
				return false;
			}).find('input[type="checkbox"]').change(function(){
				list = [];
				jQuery(this).parents('form').find('input[type="checkbox"]').each(function(){
					if(jQuery(this).attr('checked')) list.push(jQuery(this).val());
				});
				if(list.length <= 0){
					for (var i = markers.length; i--;){
						markers[i].setMap(null);
					}
					map.setCenter(google.maps.LatLng( 44.9773, -93.2733 ));
				}else{
					for(var i=0; i<locations.length; i++){
						 markers[i].setAnimation(null);
						 for(var ii=list.length; ii--;){
							if(jQuery.inArray(list[ii], locations[i].types) >=0){
								if(!markers[i].getMap()){	
									markers[i].setMap(map);
									bounds.extend(pins[i]);
								}
								break;
							} else{
								markers[i].setMap(null);
							}
						}
					}
					map.fitBounds(bounds);
				}	
			
			});
		}
	}
})

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

jQuery(function(){
jQuery('iframe').each(function(){
var url = jQuery(this).attr("src")
console.log(url);
if(url.match(/youtube/)) jQuery(this).attr("src",url+"?wmode=transparent");
});
})

