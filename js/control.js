var self = this;

function connect() {
	// 入力されたPepperのIPアドレスを取得
	var pepperIp = $("#pepperIP").val();
	
	var setupIns_ = function() {
		self.qims.service("ALTextToSpeech").done(function(ins) {
			self.alTextToSpeech = ins;
		});
		self.qims.service("ALAnimatedSpeech").done(function(ins) {
			self.alAnimatedSpeech = ins;
		});
		self.qims.service("ALMotion").done(function(ins) {
			self.alMotion = ins;
		});
		self.qims.service("ALBehaviorManager").done(function(ins) {
			self.alBehavior = ins;
		});
		self.qims.service("ALAutonomousLife").done(function(ins) {
			self.alAutonomousLife = ins;
		});
		self.qims.service("ALAudioDevice").done(function(ins) {
			self.alAudioDevice = ins;
			self.alAudioDevice.getOutputVolume().done(function(val) {
				self.showAudioVolume(val);
			});
		});
		self.qims.service("ALVideoRecorder),done(function(ins) {
			self.alVideoRecorder = ins;
		});
		self.qims.service("ALMemory").done(function(ins) {
			self.alMemory = ins;
			// メモリ監視
			qimessagingMemorySubscribe();
		});
	}
	
	// pepperへの接続を開始する
	self.qims = new QiSession(pepperIp);
	self.qims.socket()
			// 接続成功したら
			.on('connect', function() {
				self.qims.service("ALTextToSpeech").done(function(tts) {
					tts.say("接続、成功しました");
				});
				// 接続成功したら、各種セットアップを行う
				setupIns_();
				// 接続成功表示切替
				$(".connectedState > .connected > .connectedText").text("接続成功");
				$(".connectedState > .connected > .glyphicon").removeClass("glyphicon-remove");
				$(".connectedState > .connected > .glyphicon").addClass("glyphicon-signal");
				$(".connectedState > .connected").css("color", "Blue");
			})
			// 接続失敗したら
			.on('disconnect', function() {
			});
}

function showAudioVolume(val) {
	console.log(val);
	// あとからページに表示させる。
	$("#pepperVolume").val();
}

function changeAudioVolume() {
	var volume = $("#pepperVolume").val();
	volume = Number(volume);
	console.log(Number(volume));
	self.alAudioDevice.setOutputVolume(volume);
	self.hello();
}

// 動作確認用Hello
function hello(){
	console.log("hello");
	this.alAnimatedSpeech.say("はろー");
}

// おしゃべりくそやろう
function say() {
	console.log("say");
	var value = $("#sayText").val();
	this.alTextToSpeech.say(value);
}

// 動きながらおしゃべりくそやろう
function animatedSay() {
	console.log("say");
	var value = $("#animatedSayText").val();
	this.alAnimatedSpeech.say(value);
}

// 移動
function move(to) {
	if (self.alMotion) {
		consol.log("move to");
		switch (to) {
			case 0:
				self.alMotion.moveTo(0, 0, 0.5).fail(function(err) {
					console.log(err);
				});
				break;
			case 1:
				self.alMotion.moveTo(0, 0, -0.5).fail(function(err) {
					console,log(err);
				});
				break;
			case 2:
				self.alMotion.moveTo(0.3, 0, 0).fail(function(err) {
					console,log(err);
				});
				break;
			case 3:
				self.alMotion.moveTo(-0.3, 0, 0).fail(function(err) {
					console,log(err);
				});
				break;
			case 4:
				self.alMotion.moveTo(0, 0, 0).fail(function(err) {
					console,log(err);
				});
				break;
			
		}
	}
}

// 避難警報
function evacuationOrder() {
	self.alMemory.raiseEvent("evacuation/order", "地震だ");
}

// 録画開始
function startRecording() {
	self.alVideoRecorder.setFrameRate(10.0);
	self.alVideoRecorder.setResolution(2);
	self.alVideoRecorder.startRecording("/home/nao/recordings/cameras", "test");
	this.alTextToSpeech.say("録画開始");
}

function stopRecording() {
	self.alVideoRecorder.stopRecording();
	this.alTextToSpeech.say("録画終了");
}