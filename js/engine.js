var Lift = function() {
	var mallLogos = ["化工仓库", "加油站", "轻轨线", "港口", "滨海机场"]
	var clue = "二一五始皇东巡北海求仙一九九零八国联军攻占大沽津门沦陷一九七六唐山地震百万流离二零一五自贸区挂牌天津港扬帆长歌当哭为何偏偏午夜二十三点哀鸿遍野蘑菇云七十年再现连环爆炸区区只隔弹指间国家咽喉首都肝胆经济命脉亿万血汗东京北京谈话阅兵曾记否七七事变全国通电平津危则华北危华北危则中华民族危但试问真相背后谁在扬帆"
	var pressColor = "red"
	var self = this
	this.restart=false
	setTimeout("lift.restart=true",2000)
	this.initial = function() {
		this.lift = {
			speed: 30,
			distance: 0,
			trip: 0,
			lastTrip: -1,
			level: 16,
			levelNeedTrips: 5,
			speedPlusByTrip: 2,
			startHeight: 0.95 * Game.height,
			ratio: -0.25,
			angle: Math.atan(-0.25),
			baseColor: "grey",
			color: "grey"
		}
		this.cat = {
			x: 0.2 * Game.width,
			y: self.lift.startHeight + self.lift.ratio * 0.2 * Game.width,
			tween: {},
			//level: 0,
			//levelByTimes: [10, 30, 60, 100, 150, 210, 280, 360, 450, 550, 660, 780, 910, 1050, 1200, 1360, 1530, 1710],
			baseColor: "black",
			color: "black"
		}
		this.levelBar = {
			length: 20,
			at: 0
		}
		this.catHeight = {
			now: 25,
			min: 25,
			max: 100,
			reduceByTime: 5,
			plusByTime: 5,
			plusByJump: 5,
			reducePercentByJump: 0.5
		}
		this.catJump = {
			upTime: 1,
			crossTime: 1,
			//upTimes: 0,
			freezeTimer: 0,
			crossDirection: 0,
			floatFrame: 0
		}
		this.catTouch = {
			left: 15,
			right: 15
		}
		this.trap = {
			traps: [
				[-0.4 * Game.width, 5]
			],
			lengthByTrip: 5,
			maxToTrips: 15,
			amountOfTrip: 2
		}
		this.sprite = {
			splitWords: clue.split(''),
			splitLength: 153,
			sprites: [
				[-0.6 * Game.width, this.lift.startHeight + this.lift.ratio * Game.width - 50, "前"]
			], //x,y,value
			collected: [], //value
			collectedAmount: 0,
			box: 20
		}
	}
	this.initial()
	this.guide = {
		on: list.played <= 2 ? true : false,
		times: 0,
		timer: 0
	}
	this.inPause = false
	this.continueGame = function() {
		this.initial()
		this.cancelPause()
	}
	this.cancelPause = function() {
		setTimeout("lift.inPause = false", 500)
	}
	this.checkGuide = function(dt) {
		this.guide.timer += dt
		if (this.guide.timer > 1000 && this.guide.times == 0) {
			this.inPause = true
			this.guide.times++
				confirm("点击神经猫上下跳\n从爆炸尘埃中收集线索") ? this.cancelPause() : this.cancelPause()
		} else if (this.guide.timer > 3000 && this.guide.times == 1) {
			this.inPause = true
			this.guide.times++
				confirm("点击两侧左右跳\n不要碰到红色易爆炸物") ? this.cancelPause() : this.cancelPause()
		}
	}
	this.checkTrapCollision = function() {
		for (var i = 0, length = this.trap.traps.length; i < length; i++) {
			var trapX = Game.width + this.trap.traps[i][0] - this.lift.distance
			if (this.cat.x >= trapX && this.cat.x <= trapX + this.trap.traps[i][1] && !this.cat.tween.nowFrame > 0) {
				Tween.clear.call(this.cat.tween)
				Tween.create.call(this.cat.tween, "translate", 1, false, function() {}, "linear", 0, 0, 0, Game.height - this.lift.startHeight-Game.width*this.lift.ratio, 1)
				this.inPause = true
				setTimeout("confirm('你的神经猫特工搜集到'+lift.sprite.collectedAmount+'条线索'+'，继续不') ? lift.continueGame() :''", 1000)
				document.title = "【寻找塘沽真相】我的神经猫特工搜集到" + this.sprite.collectedAmount + "条线索，击败" + Math.round(100 * this.sprite.collectedAmount / this.sprite.splitLength) + "%的人，牺牲在第" + this.lift.level + "搜索区"
			}
		}
	}
	this.checkSpriteCollision = function() {
		var jumpHeight = this.cat.tween.nowFrame ? -this.cat.tween.frameEvents.translate[2 * this.cat.tween.nowFrame + 1] : 0
		for (var i = 0; i < this.sprite.sprites.length; i++) {
			var spriteX = Game.width + this.sprite.sprites[i][0] - this.lift.distance
			var spriteY = this.sprite.sprites[i][1] - (Game.width - spriteX) * this.lift.ratio
			var catTop = this.cat.y - this.catHeight.now - jumpHeight
			var catBottom = this.cat.y - jumpHeight
			if ((this.cat.x >= spriteX - 0.5 * this.sprite.box) && (this.cat.x <= spriteX + 0.5 * this.sprite.box) && (catTop <= spriteY + 0.5 * this.sprite.box) && (catBottom >= spriteY - 0.5 * this.sprite.box)) {
				if (this.sprite.sprites[i][2] == -1) {
					Tween.clear.call(this.cat.tween)
					Tween.create.call(this.cat.tween, "translate", 1, false, function() {}, "linear", 0, 0, 0, -this.lift.startHeight, 1)
					this.inPause = true
					setTimeout("confirm('你的神经猫特工搜集到'+lift.sprite.collectedAmount+'条线索'+'，继续不') ? lift.continueGame() :''", 1000)
					document.title = "【寻找塘沽真相】我的神经猫特工搜集到" + this.sprite.collectedAmount + "条线索，击败" + Math.round(100 * this.sprite.collectedAmount / this.sprite.splitLength) + "%的人，牺牲在第" + this.lift.level + "搜索区"
				} else {
					this.sprite.collected.push(this.sprite.sprites[i][2])
					this.sprite.collectedAmount++
						if (this.sprite.collected.length == this.sprite.splitLength) {
							this.inPause = true
							setTimeout("confirm('你的神经猫特工搜集到'+lift.sprite.collectedAmount+'条线索'+'，继续不') ? lift.continueGame() :''", 1000)
							document.title = "【寻找塘沽真相】我的神经猫特工搜集到" + this.sprite.collectedAmount + "条线索，击败" + Math.round(100 * this.sprite.collectedAmount / this.sprite.splitLength) + "%的人，出色的完成了任务"
						}
				}
				this.sprite.sprites.splice(i, 1)
				i--
			}
		}
	}
	this.checkHeight = function(dt) {
		if (this.catHeight.now < this.catHeight.min) {
			this.catHeight.now += dt / (1000 / this.catHeight.plusByTime)
		} else {
			this.catHeight.now -= dt / (1000 / this.catHeight.reduceByTime)
		}
	}
	this.checkCross = function(dt) {
		if (this.catJump.crossDirection) {
			this.jcSpeed += this.jcAcc * dt / 1000
			this.cat.x += this.jcSpeed * dt / 1000 - 0.5 * this.jcAcc * Math.pow(dt / 1000, 2)
			this.cat.y = this.lift.startHeight + this.lift.ratio * this.cat.x
			if (this.catJump.crossDirection * this.jcSpeed <= 0) {
				this.jcAcc = 0
				this.jcSpeed = 0
				this.catJump.crossDirection = 0
			}
		}
	}
	this.checkFreeze = function(dt) {
		if (this.catJump.freezeTimer > 0) {
			this.catJump.freezeTimer -= dt / 1000
		}
		if (this.catJump.freezeTimer < 0) {
			this.catJump.freezeTimer = 0
		}
	}
	this.plusLevel = function() {
		this.levelBar.at += 2
		if (this.cat.levelByTimes[this.cat.level] && this.catJump.upTimes == this.cat.levelByTimes[this.cat.level]) {
			this.cat.level++
				if (this.cat.levelByTimes[this.cat.level]) {
					this.levelBar.length = 2 * (this.cat.levelByTimes[this.cat.level] - this.cat.levelByTimes[this.cat.level - 1])
					this.levelBar.at = 0
				}
		}
	}
	this.checkPress = function() {
		if (Game.touch.touched && Game.touch.X > 0 && Game.touch.X < Game.width) {
			var height = this.cat.tween.nowFrame ? Math.floor(this.catHeight.now * this.cat.tween.plusAllFrame / this.cat.tween.nowFrame) : this.catHeight.now
			if (Game.touch.X >= this.cat.x - this.catTouch.left && Game.touch.X <= this.cat.x + this.catTouch.right) {
				this.cat.color = pressColor
				setTimeout("lift.cat.color=lift.cat.baseColor", 200)
				if (this.cat.tween.nowFrame >= 0.5 * this.cat.tween.plusAllFrame || !this.cat.tween.nowFrame) {
					//console.log("now:" + this.cat.tween.nowFrame + ";all:" + this.cat.tween.allFrame + ";plusAll:" + this.cat.tween.plusAllFrame + ";catHeight:" + this.catHeight.now + ";height:" + height)
					if (this.catJump.freezeTimer == 0) {
						Tween.clear.call(this.cat.tween)
						this.startJumpUp(this.catJump.upTime, height)
							//this.catJump.upTimes++
							//this.plusLevel()
					}
				} else {
					Tween.clear.call(this.cat.tween)
					this.catJump.freezeTimer = 1
				}
			} else {
				this.lift.color = pressColor
				setTimeout("lift.lift.color=lift.lift.baseColor", 200)
				if (this.catJump.crossDirection) {
					this.jcAcc = 0
					this.jcSpeed = 0
					this.catJump.crossDirection = 0
				}
				Tween.clear.call(this.cat.tween)
				this.startJumpCross(this.catJump.crossTime, Game.touch.X - this.cat.x, height)
			}
			Game.touch.touched = false
			Game.touch.X = null
			Game.touch.Y = null
		}
	}
	this.startJumpUp = function(time, height) {
		Tween.create.call(this.cat.tween, "translate", 1, false, function() {}, "linear", 0, 0, 0, -height, time / 2)
		Tween.create.call(this.cat.tween, "translate", 1, true, function() {}, "linear", 0, -height, 0, 0, time / 2)
		if (this.catHeight.now < this.catHeight.max) this.catHeight.now += this.catHeight.plusByJump
	}
	this.startJumpCross = function(time, distance, height) {
		this.catJump.crossDirection = distance < 0 ? -1 : 1
		var realDistance = this.catJump.crossDirection * Math.min(this.catHeight.now, Math.abs(distance))
		var catEndingX = this.cat.x + realDistance
		var catEndingY = this.lift.startHeight + this.lift.ratio * catEndingX
		this.catHeight.now -= Math.abs(realDistance * this.catHeight.reducePercentByJump)
		this.jcSpeed = 2 * realDistance / time //v=2*s/t
		this.jcAcc = -this.jcSpeed / time //a=-v/t
		this.startJumpUp(time, height)
		this.cat.tween.nowFrame = this.catJump.floatFrame
	}
	this.spriteGenerator = function() {
		var part = rndc(2)
		for (var i = 0; i < part; i++) {
			var isWord = Math.random() < 0.5 ? (this.sprite.splitWords.length > 0 ? true : false) : false
			var wordParry = 5 * (16 - this.lift.level) + 5 * rndc(16 - this.lift.level)
			var bombParry = 5 * (16 - this.lift.level) + 5 * rndc(16 - this.lift.level) + 20
			this.sprite.sprites.push([rndf(Game.width / part) + i * Math.floor(Game.width / part) + Game.width * this.lift.trip, this.lift.startHeight + this.lift.ratio * Game.width - 50 - (isWord ? wordParry : bombParry), isWord ? this.sprite.splitWords[0] : -1])
			if (isWord) {
				this.sprite.splitWords.splice(0, 1)
			}
		}
	}
	this.spriteUnload = function() {
		for (var i = 0; i < this.sprite.sprites.length; i++) {
			var spriteX = Game.width + this.sprite.sprites[i][0] - this.lift.distance
			if (spriteX < -this.sprite.box) {
				if (this.sprite.sprites[i][2] != -1) {
					this.sprite.collected.push("?")
				}
				this.sprite.sprites.splice(i, 1)
				i--
				if (this.sprite.collected.length == this.sprite.splitLength) {
					this.inPause = true
					setTimeout("confirm('你的神经猫特工搜集到'+lift.sprite.collectedAmount+'条线索'+'，继续不') ? lift.continueGame() :''", 1000)
					document.title = "【寻找塘沽真相】我的神经猫特工搜集到" + this.sprite.collectedAmount + "条线索，击败" + Math.round(100 * this.sprite.collectedAmount / this.sprite.splitLength) + "%的人，失踪在第" + this.lift.level + "区至今未归"
				}
			}
		}
	}
	this.trapGenerator = function() {
		var part = rndc(this.trap.amountOfTrip)
		for (var i = 0; i < part; i++) {
			this.trap.traps.push([rndf(Game.width / part) + i * Math.floor(Game.width / part) + Game.width * this.lift.trip, this.trap.lengthByTrip * rndc(1 + Math.min(this.trap.maxToTrips, this.lift.trip))])
		}
	}
	this.trapUnload = function() {
		for (var i = 0; i < this.trap.traps.length; i++) {
			var trapX = Game.width + this.trap.traps[i][0] - this.lift.distance
			if (trapX < -this.trap.traps[i][1]) {
				this.trap.traps.splice(i, 1)
				i--
			}
		}
	}
	this.checkTrip = function() {
		if (this.lift.trip != this.lift.lastTrip) {
			this.lift.lastTrip = this.lift.trip
			if (this.lift.trip % this.lift.levelNeedTrips == 0) {
				this.lift.level--
					if (this.lift.level != 15) {
						this.inPause = true
						confirm("当前区域搜索完毕，是否进入第" + this.lift.level + "搜索区") ? this.cancelPause() : ""
					} else if(!this.restart) {
						this.inPause = true
						confirm("你怀着沉痛的心情来到塘沽，是否进入第" + this.lift.level + "搜索区") ? this.cancelPause() : ""
					}
			}
			this.lift.speed += this.lift.speedPlusByTrip
			this.trapGenerator()
			this.spriteGenerator()
		}
		this.trapUnload()
		this.spriteUnload()
	}
	this.drawLevel = function(ctx) {
		ctx.save()
		ctx.lineWidth = 5
		ctx.strokeStyle = "grey"
		ctx.beginPath()
		ctx.moveTo(0.5 * Game.width - this.levelBar.length / 2, 10)
		ctx.lineTo(0.5 * Game.width + this.levelBar.length / 2, 10)
		ctx.stroke()
		ctx.strokeStyle = "red"
		ctx.beginPath()
		ctx.moveTo(0.5 * Game.width - this.levelBar.at / 2, 10)
		ctx.lineTo(0.5 * Game.width + this.levelBar.at / 2, 10)
		ctx.stroke()
		ctx.restore()
	}
	this.drawSprite = function(ctx) {
		ctx.save()
		ctx.textAlign = "center"
		for (var j = 0, length = this.sprite.collected.length; j < length; j++) {
			ctx.fillStyle = "grey"
			ctx.fillRect(21 * (j % 15) + 12 - 0.5 * this.sprite.box, 50 + Math.floor(j / 15) * 21 - 0.5 * this.sprite.box, this.sprite.box, this.sprite.box)
			ctx.fillStyle = "white"
			ctx.fillText(this.sprite.collected[j][0], 21 * (j % 15) + 12, 50 + Math.floor(j / 15) * 21 + 0.4 * this.sprite.box)
		}
		for (var i = 0, length = this.sprite.sprites.length; i < length; i++) {
			var spriteX = Game.width + this.sprite.sprites[i][0] - this.lift.distance
			var spriteY = this.sprite.sprites[i][1] - (Game.width - spriteX) * this.lift.ratio
			if (spriteX < Game.width) {
				if (this.sprite.sprites[i][2] == -1) {
					ctx.fillStyle = "red"
					ctx.fillRect(spriteX - 0.5 * this.sprite.box, spriteY - 0.5 * this.sprite.box, this.sprite.box, this.sprite.box)
				} else {
					ctx.fillStyle = "grey"
					ctx.fillRect(spriteX - 0.5 * this.sprite.box, spriteY - 0.5 * this.sprite.box, this.sprite.box, this.sprite.box)
					ctx.fillStyle = "white"
					ctx.fillText("?", spriteX, spriteY + 0.4 * this.sprite.box)
				}
			}
		}
		ctx.restore()
	}
	this.drawTrap = function(ctx) {
		ctx.save()
		ctx.lineWidth = 5
		ctx.strokeStyle = "red"
		for (var i = 0, length = this.trap.traps.length; i < length; i++) {
			ctx.beginPath()
			var trapX = Game.width + this.trap.traps[i][0] - this.lift.distance
			if (trapX < Game.width) {
				ctx.moveTo(trapX, trapX * this.lift.ratio + this.lift.startHeight + 5)
				ctx.lineTo(trapX + this.trap.traps[i][1], (trapX + this.trap.traps[i][1]) * this.lift.ratio + this.lift.startHeight + 5)
				ctx.stroke()
			}
		}
		ctx.restore()
	}
	this.drawCat = function(ctx) {
		ctx.save()
		ctx.fillStyle = this.cat.color
		ctx.textAlign = "center"
		ctx.lineWidth = 5
		ctx.strokeStyle = this.cat.color
		ctx.beginPath()
		ctx.moveTo(this.cat.x, this.cat.y)
		ctx.lineTo(this.cat.x, this.cat.y - this.catHeight.now)
		ctx.fillText("猫", this.cat.x, this.cat.y - this.catHeight.now * (1 - this.catJump.freezeTimer))
		ctx.stroke()
		ctx.restore()
	}
	this.drawMallLogos = function(ctx) {
		this.logo = this.lift.level + "区：" + mallLogos[this.lift.trip % 5]
		this.fillX = Game.width - this.lift.distance % Game.width
		ctx.save()
		ctx.font = base_font["15"]
		ctx.fillStyle = "grey"
		ctx.textAlign = "right"
		ctx.fillText(this.logo, this.fillX, this.lift.ratio * this.fillX + 1.05 * Game.height)
		ctx.restore()
	}
	this.drawLift = function(ctx) {
		ctx.save()
		ctx.fillStyle = "red"
		ctx.textAlign = "center"
		ctx.font = base_font["20b"]
			//ctx.fillText("dist:" + Math.round(this.lift.distance) + ";trip:" + this.lift.trip + ";trap:" + this.trap.traps, 0, 20)
		ctx.fillText("神经猫特工：塘沽真相" + this.sprite.collectedAmount + "条线索", 0.5 * Game.width, 30)
		ctx.lineWidth = 5
		ctx.beginPath()
		ctx.moveTo(0, this.lift.startHeight)
		ctx.lineTo(Game.width, this.lift.startHeight + this.lift.ratio * Game.width)
		ctx.strokeStyle = this.lift.color
		ctx.stroke()
		ctx.restore();
	}
	this.step = function(dt) {
		if (!this.inPause) {
			this.lift.distance += this.lift.speed * dt / 1000;
			this.lift.trip = Math.floor(this.lift.distance / Game.width)
			this.checkTrip()
			this.checkPress()
			this.checkCross(dt)
			this.checkFreeze(dt)
			this.checkHeight(dt)
			this.checkTrapCollision()
			this.checkSpriteCollision()
			if (this.guide.on) {
				this.checkGuide(dt)
			}
		}
	}
	this.draw = function(dt, ctx) {
		this.drawLift(ctx)
		this.drawMallLogos(ctx)
		this.drawTrap(ctx)
		this.drawSprite(ctx)
		ctx.save()
		Tween.play.call(this.cat.tween)
		this.drawCat(ctx)
		ctx.restore()
	}
}