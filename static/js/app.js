var Main = React.createClass({
  componentDidMount: function() {
    window.scrollUp = this.scrollUp;
    window.scrollDown = this.scrollDown;
  },
  
  scrollUp: function() {
    $('html, body').animate({
      scrollTop: 0,
      scrollLeft: 0
    }, 400);
  },
  
  scrollDown: function() {
    $('html, body').animate({
      scrollTop: document.body.scrollHeight,
      scrollLeft: 0
    }, 400);
  },
  
  render: function() {
    return (
      <div className="site-wrapper">
        <a href="https://github.com/christinang89/wfh-ninja">
          <img style={{position: 'absolute', top: 0, right: 0, border: 0}} src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"/>
        </a>
        <Quotes />
        <SubmitForm />
        <div className="mastfoot clearfix">
          <div className="inner">                
            <nav>
              <ul className="nav mastfoot-nav">
                <li><a href="#"><div onClick={this.scrollDown}>Submit</div></a></li>
                <li><a href="#">Docs</a></li>
                <li><a href="#">About</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  }
});

React.render(<Main />, document.body);
