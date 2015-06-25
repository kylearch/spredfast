var Leaderboard = Backbone.View.extend({

	initialize: function() {
		this.itemsInLeaderboard = 5;

		this.interval = 15000;

		this.data = {};

		this.flags = {
			veggies: false,
			fruits: false,
		};

		this.hasLoaded = false;

		this.poller = new spredfast.Poller();

		this.render();
	},

	render: function() {
		var self = this;

		this.pollBoth();
		this.loop = setInterval(function() {
			self.pollBoth();
		}, this.interval);
	},

	setResults: function(results, type) {
		this.flags[type] = true;

		for (var i in results) this.data[results[i].name] = results[i].count;

		if (this.flags.veggies && this.flags.fruits) {
			this.updateLeaderboard();
		}
	},

	sortResults: function() {
		tmp = [];
		for (var i in this.data) {
			tmp.push([i, this.data[i]]);
		}
		tmp.sort( function(a, b) { return b[1] - a[1]; } );
		return tmp;
	},

	updateLeaderboard: function(results) {
		this.flags.veggies = false;
		this.flags.fruits = false;

		var newResults = this.sortResults(this.data);

		for (var i = 0; i < this.itemsInLeaderboard; i++) {
			var item = newResults[i],
				$li = $(".produce").eq(i);
			this.switch($li, item[0], item[1]);
		}
		self.hasLoaded = true;
	},

	switch: function($li, name, number) {
		var self = this,
			$inner = $li.find('.inner');

		$inner.fadeOut(function() {
			if (!self.hasLoaded) $li.find('.mentions').removeClass('hidden');
			$li.find('.name').text(name);
			$li.find('.number').text(self.numberFormat(number));
			$inner.fadeIn();
		});
	},

	pollBoth: function() {
		this.poll('veggies');
		this.poll('fruits');
	},

	poll: function(type) {
		var self = this;
		this.poller.poll({ type: type }, function(results) {
			self.setResults(results, type);
		});
	},

	numberFormat: function(num) {
    	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},

});

new Leaderboard({ el: $("#leaderboard") });