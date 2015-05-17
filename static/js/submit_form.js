var SubmitForm = React.createClass({
  getInitialState: function() {
    return {
      quoteText: ''
    };
  },

  submit: function() {

  },

  render: function() {
    return (
      <form onSubmit={this.submit}>
        <div className="form-group">
          <label for="suggestedQuote">I'm working from home because...</label>
          <input type="text" className="form-control" placeholder="Reason" value={this.state.quoteText}/>
        </div>
        <button type="submit" className="btn btn-default">Submit</button>
      </form>
    );
  }
});
