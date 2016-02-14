

var Photo = React.createClass({
  displayName: 'Photo',
  render: function () {
    return (
      React.createElement('div', {
        className: "card"
      },
      React.createElement('img', {
        src: this.props.src,
        alt: this.props.alt
      }),
      React.createElement('p', {
        className: 'card-text'
      }, this.props.caption))
    );
  }
});

var PhotoList = React.createClass({
  displayName: 'PhotoList',
  render: function () {
    var photos = this.props.photos.map(function (photo) {
      return React.createElement(Photo, photo);
    })
    return (
      React.createElement('div', {
          className: "album text-muted"
        },
        React.createElement('div', {
          className: "container"
        }, React.createElement("div", {
          className: "row"
        },
        photos
        )))
      );
  }
});

var Search = React.createClass({
  displayName: "Search",
  getInitialState: function() {
    return {
      refreshTime: 5,
      autoRefresh: false,
      q: ""
    };
  },
  componentDidMount: function() {
    setInterval(function() {
      if(this.state.autoRefresh && this.state.q !== "") {
        if(this.state.refreshTime === 0) {
          this.doSearch();
          this.setState({
            refreshTime: 5
          });
        } else {
          this.setState({
            refreshTime: this.state.refreshTime - 1
          });
        }
      }
    }.bind(this), 1000);
  },
  doSearch: function() {
    var q = this.state.q;
    if(q) {
      this.props.onSearch(q);
    }
  },
  render: function () {
    function onChange(ev) {
      this.setState({q: ev.target.value});
    }
    function toggleAutoRefresh(ev) {
      var autoRefresh = ev.target.checked;
      if(autoRefresh) {
        this.setState({
          refreshTime: 5,
          autoRefresh: true
        })
      } else {
        this.setState({autoRefresh: false})
      }
    }
    return (
      React.createElement("section", { className: "jumbotron text-xs-center" },
        React.createElement("div", { className: "container" },
          React.createElement("div", {className: "input-group"},
            React.createElement("input", {
              className: "form-control",
              onChange: onChange.bind(this),
              value: this.state.q,
              onKeyUp: function(e) {
                if(e.keyCode === 13) {
                  this.doSearch.call(this);
                }
              }.bind(this)
            }),
            React.createElement("div", {className: "input-group-btn"},
              React.createElement("button", {
                onClick: this.doSearch.bind(this),
                type: "button",
                className: "btn btn-primary"
              }, "Search")
            )
          ),
          React.createElement("div", {className: "checkbox"},
            React.createElement("label", null,
              React.createElement("input", {
                type: "checkbox",
                checked: this.state.autoRefresh,
                onChange: toggleAutoRefresh.bind(this)
              }),
              (this.state.autoRefresh ? "Will auto refresh in "+this.state.refreshTime+" seconds" : "Enable auto refresh")
            )
          )
        )
      )
    );
  }
});

var App = React.createClass({
  displayName: 'App',
  render: function () {
    return (
      React.createElement('div', { className: "app" },
        React.createElement(Search, { onSearch: this.props.onSearch }),
        React.createElement(PhotoList, { photos: this.props.photos })
      )
    );
  }
});

function send(url, cb) {
  if(typeof window.fetch === "function") {
    fetch(url).then(function (response) {
      return response.json();
    }).then(cb);
  } else {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (req.readyState == XMLHttpRequest.DONE) {
        cb(JSON.parse(req.responseText));
      }
    }
    req.open("GET", url);
    req.send();
  }
}

function search(query) {
  console.log("searching for", query);
  var url = "flickr?q=" + query;
  send(url, function (photos) {
    render(photos.map(function (photo) {
      return {
        caption: photo.title,
        src: photo.small,
        alt: photo.title
      };
    }));
  });
}

function render(photos) {
    ReactDOM.render(
        React.createElement(App, {
            photos: photos,
            onSearch: search
        }), document.getElementById('app'));
}
render([]);
