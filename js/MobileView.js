'use strict';

function reactRender() {
	function onYouTubeIframeAPIReady(element, id) {
		var player = new YT.Player(element, {
			heidth: 'auto',
			width: '100%',
			videoId: id,
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	}
	function onPlayerReady(event) {
		// event.target.playVideo();
	}

	function onPlayerStateChange(event) {}

	var Rows = React.createClass({
		displayName: 'Rows',

		getInitialState: function getInitialState() {
			return { data: [] };
		},
		componentDidMount: function componentDidMount() {
			for (var i = 0; i < applicationData.Pages.length; i++) {
				if (indexPage == applicationData.Pages[i].Id) {
					this.setState({ data: applicationData.Pages[i].Rows });
				}
			}
		},
		render: function render() {
			var rowModels = this.state.data.map(function (row) {
				return React.createElement(CellContainer, { data: row, key: row.Id });
			});
			return React.createElement(
				'div',
				{ className: 'container-fluid' },
				rowModels
			);
		}
	});

	var CellContainer = React.createClass({
		displayName: 'CellContainer',

		render: function render() {
			var cellModels = this.props.data.CellContents.map(function (cell) {
				return React.createElement(CellContent, { data: cell, key: cell.Id });
			});
			return React.createElement(
				'div',
				{ className: 'row' },
				cellModels
			);
		}
	});

	var GalleryContainer = React.createClass({
		displayName: 'GalleryContainer',

		render: function render() {
			var icon = _.where(this.props.data, { IsGalleryIcon: true });
			var items = _.without(this.props.data, icon);
			if (icon.length > 0) {
				return React.createElement(
					'div',
					{ className: 'gallery-images-container' },
					React.createElement(
						'div',
						{ className: 'icon-container' },
						this.createIcon(this.props.data)
					),
					React.createElement(
						'div',
						{ className: 'my-gallery' },
						this.createItems(this.props.data)
					)
				);
			} else {
				return React.createElement(
					'div',
					{ className: 'gallery-images-container' },
					React.createElement(
						'div',
						{ className: 'shadow-container' },
						this.createIcon(this.props.data)
					),
					React.createElement(
						'div',
						{ className: 'my-gallery' },
						this.createItems(this.props.data)
					)
				);
			}
		},
		componentDidMount: function componentDidMount() {
			initPhotoSwipeFromDOM(".my-gallery");
		},
		createIcon: function createIcon(items) {
			var icon = _.where(items, { IsGalleryIcon: true });
			items = _.without(items, icon);
			if (icon.length > 0) {
				return React.createElement('img', { src: icon[0].Link, className: 'gallery-icon' });
			} else {
				//return React.createElement('img',{src:"file:///android_asset/www/images/gallery-shadow.png", className: 'gallery-icon gallery-shadow'});
				return React.createElement('img', { src: "file:///android_asset/www/images/noimage.gif", className: 'gallery-icon gallery-shadow' });
			}
		},
		createItems: function createItems(items) {
			var output = [];

			var icon = _.where(items, { IsGalleryIcon: true });
			items = _.where(items, { IsGalleryIcon: false });
			for (var i = 0; i < items.length; i++) {
				if (i == 0 && icon.length == 0) {
					output.push(React.createElement(
						'figure',
						{ key: items[i].Id },
						React.createElement(
							'a',
							{ href: items[i].Link, className: 'galleryHref', itemProp: 'contentUrl', 'data-size': '964x1024' },
							React.createElement('img', { src: items[i].Link, alt: 'Image description', className: 'gallery-image' })
						)
					));
				} else {
					output.push(React.createElement(
						'figure',
						{ className: 'hidden', key: items[i].Id },
						React.createElement(
							'a',
							{ href: items[i].Link, className: 'galleryHref', itemProp: 'contentUrl', 'data-size': '964x1024' },
							React.createElement('img', { src: items[i].Link, alt: 'Image description', className: 'gallery-image' })
						)
					));
				}
			}
			return output;
		}
	});

	var YoutubeContainer = React.createClass({
		displayName: "YoutubeContainer",

		render: function render() {
			return React.createElement('div', { className: 'my-youtube' });
		},

		componentDidMount: function componentDidMount() {

			var reg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
			var value = this.props.data;
			if (value.split('src="').length > 1) {
				value = value.split('src="');
				value = value[1].split('"');
			} else {
				value = value.split("src='");
				value = value[1].split("'");
			}

			var url = value[0];
			var id = url.match(reg);
			var player;
			onYouTubeIframeAPIReady(ReactDOM.findDOMNode(this), id[1]);
		}
	});

	var Hbox = React.createClass({
		displayName: 'Hbox',

		componentDidMount: function componentDidMount() {
			var data = Base64.decode(this.props.data);
			var json = JSON.parse(data);
			//$(ReactDOM.findDOMNode(this));
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				slidesPerView: json.quantity,
				paginationClickable: true,
				spaceBetween: 10
			});
		},
		render: function render() {
			var data = Base64.decode(this.props.data);
			var json = JSON.parse(data);

			var elementModels = json.elements.map(function (element) {
				if (element.ContentTypeId == 2) {
					return React.createElement(
						'div',
						{ className: 'swiper-slide' },
						React.createElement('div', { className: 'link-item', dangerouslySetInnerHTML: { __html: element.Value } })
					);
				}
				if (element.ContentTypeId == 3) {
					return React.createElement(
						'div',
						{ className: 'swiper-slide' },
						React.createElement('div', { className: 'image-item', dangerouslySetInnerHTML: { __html: element.Value } })
					);
				}
				if (element.ContentTypeId == 4) {
					return React.createElement(
						'div',
						{ className: 'swiper-slide' },
						React.createElement('div', { className: 'image-link-item', dangerouslySetInnerHTML: { __html: element.Value } })
					);
				}
				if (element.ContentTypeId == 5) {
					return React.createElement(
						'div',
						{ className: 'swiper-slide' },
						React.createElement('div', { className: 'text-item', dangerouslySetInnerHTML: { __html: element.Value } })
					);
				}
				if (element.ContentTypeId == 6) {
					return React.createElement(
						'div',
						{ className: 'swiper-slide' },
						React.createElement('div', { className: 'botton-item', dangerouslySetInnerHTML: { __html: element.Value } })
					);
				}
				if (element.ContentTypeId == 7) {
					return React.createElement(
						'div',
						{ className: 'swiper-slide' },
						React.createElement(YoutubeContainer, { data: element.Value })
					);
				}
				if (element.ContentTypeId == 8) {
					return React.createElement(
						'div',
						{ className: 'swiper-slide' },
						React.createElement(GalleryContainer, { data: element.Resourceses })
					);
				}
				if (element.ContentTypeId == 9) {
					return React.createElement(
						'div',
						{ className: 'swiper-slide' },
						React.createElement('div', { className: 'difficult-botton-item', dangerouslySetInnerHTML: { __html: element.Value } })
					);
				}
			});

			return React.createElement(
				'div',
				{ className: 'hBox-container swiper-container' },
				React.createElement(
					'div',
					{ className: 'swiper-wrapper' },
					elementModels
				),
				React.createElement('div', { className: 'swiper-pagination' })
			);
		}
	});

	var CellContent = React.createClass({
		displayName: 'CellContent',

		componentDidMount: function componentDidMount() {
			var styleCell = this.props.data.Style;

			if (styleCell == undefined || styleCell == null) {
				styleCell = "";
			}

			//$(React.findDOMNode(this)).attr("style", styleCell);
			$(ReactDOM.findDOMNode(this)).attr("style", styleCell);
		},
		render: function render() {
			var data = this.props.data;

			if (data.ContentTypeId == 3) {
				return React.createElement('div', { className: "cell-container col-xs-" + data.Colspan + " col-sm-" + data.Colspan + " col-md-" + data.Colspan + " col-lg-" + data.Colspan, dangerouslySetInnerHTML: { __html: data.Value } });
			}
			if (data.ContentTypeId == 4) {
				return React.createElement('div', { className: "cell-container col-xs-" + data.Colspan + " col-sm-" + data.Colspan + " col-md-" + data.Colspan + " col-lg-" + data.Colspan, dangerouslySetInnerHTML: { __html: data.Value } });
			}
			if (data.ContentTypeId == 5) {
				return React.createElement('div', { className: "cell-container col-xs-" + data.Colspan + " col-sm-" + data.Colspan + " col-md-" + data.Colspan + " col-lg-" + data.Colspan, dangerouslySetInnerHTML: { __html: data.Value } });
			}
			if (data.ContentTypeId == 6) {
				return React.createElement('div', { className: "cell-container col-xs-" + data.Colspan + " col-sm-" + data.Colspan + " col-md-" + data.Colspan + " col-lg-" + data.Colspan, dangerouslySetInnerHTML: { __html: data.Value } });
			}
			if (data.ContentTypeId == 2) {
				return React.createElement('div', { className: "cell-container col-xs-" + data.Colspan + " col-sm-" + data.Colspan + " col-md-" + data.Colspan + " col-lg-" + data.Colspan, dangerouslySetInnerHTML: { __html: data.Value } });
			}
			if (data.ContentTypeId == 1) {
				return React.createElement('div', { className: "cell-container col-xs-" + data.Colspan + " col-sm-" + data.Colspan + " col-md-" + data.Colspan + " col-lg-" + data.Colspan, dangerouslySetInnerHTML: { __html: data.Value } });
			}
			if (data.ContentTypeId == 8) {
				return React.createElement(
					'div',
					{ className: "cell-container col-xs-" + data.Colspan + " col-sm-" + data.Colspan + " col-md-" + data.Colspan + " col-lg-" + data.Colspan, onClick: this.onClickCell },
					React.createElement(GalleryContainer, { data: data.Resourceses })
				);
			}
			if (data.ContentTypeId == 9) {
				return React.createElement('div', { className: "cell-container col-xs-" + data.Colspan + " col-sm-" + data.Colspan + " col-md-" + data.Colspan + " col-lg-" + data.Colspan, onClick: this.onClickCell, dangerouslySetInnerHTML: { __html: data.Value } });
			}
			if (data.ContentTypeId == 7) {
				return React.createElement(
					'div',
					{ className: "cell-container col-xs-" + data.Colspan + " col-sm-" + data.Colspan + " col-md-" + data.Colspan + " col-lg-" + data.Colspan, onClick: this.onClickCell },
					React.createElement(YoutubeContainer, { data: data.Value })
				);
			}

			//ContentTypeId - 10 start
			if (data.ContentTypeId == 10) {
				return React.createElement(
					'div',
					{ className: "cell-container col-xs-" + data.Colspan + " col-sm-" + data.Colspan + " col-md-" + data.Colspan + " col-lg-" + data.Colspan },
					React.createElement(Hbox, { data: data.Json })
				);
			}
		}
	});

	//ContentTypeId - 10 end

	ReactDOM.render(React.createElement(Rows, null), document.getElementById('container'));
}