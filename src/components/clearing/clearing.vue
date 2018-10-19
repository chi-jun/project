<template>
  <div class="clearing-container clearfix">
    <!-- 结算页面左 -->
    <p class="return" v-if="clearing" @click="back">
      <i class="iconfont icon-zuo"></i>
    </p>
    <!-- 地址 -->
    <section class="clearing-site" @click="toSelectionSite" :id="clearingSite.addressId">
      <p>
        <span>{{ clearingSite.name }}</span>
        <span>{{ clearingSite.phone }}</span>
      </p>
      <p>
        {{ clearingSite.site }}
      </p>
      <router-link to="/clearing" tag="p">
        <i class="iconfont icon-you"></i>
      </router-link>
    </section>
    <!-- 内容 -->
    <section class="clearing-con clearfix">
      <article class="clearing-con-list clearfix" v-for="(item, index) in resultData">
        <div class="clearing-con-pic">
          <img :src="item.productAdImg" :alt="item.title">
        </div>
        <div class="clearing-con-wrap">
          <h4 class="clearing-con-title">{{ item.title }}</h4>
          <p class="clearing-con-msg">{{ item.description }}</p>
          <div class="clearing-con-price">
            <p><span>￥</span>{{ item.realPrice }}</p>
            <p>x{{ item.repertory }}</p>
          </div>
        </div>
        <div class="clearing-con-tag">
          <p v-if="item.isPackage == 1">包邮</p>
          <p v-if="item.isCheap == 1">特惠</p>
          <p v-if="item.isAct == 1">活动</p>
          <p v-if="item.isTimeDiscount == 1">限时优惠 </p>
        </div>
      </article>
    </section>
    <!-- 发票 优惠卷 -->
    <section class="clearing-list-wrap">
      <router-link to="/invoice" tag="article" class="clearing-list">
        <p class="label">发票</p>
        <p class="con" v-if="invoice.materialType !== ''">
          明细 ( <span v-if="invoice.materialType == 0">纸质发票</span><span v-if="invoice.materialType == 1">电子发票</span> ) -
          <span v-if="invoice.unitName == '个人'">个人</span><span v-if="invoice.unitName == '单位'">单位</span>
        </p>
        <p class="con" v-else-if="invoice.materialType == ''">无</p>
        <p class="icon"><i class="iconfont icon-you"></i></p>
      </router-link>
      <router-link to="/payment-coupons" tag="article" class="clearing-list">
        <p class="label">优惠卷</p>
        <p class="con" v-if="deduction.num === 0">无</p>
        <p class="con" v-if="deduction.num !== 0">-￥{{ deduction.num }}</p>
        <p class="icon"><i class="iconfont icon-you"></i></p>
      </router-link>
    </section>

    <!-- 合计付款 -->
    <section class="clearing-foot-payment">
      <p>
        <span>合计:</span>
        <span>￥{{ sum }}</span>
        <span v-if="clearing.cartResult.postage == null || clearing.cartResult.postage == 0">包邮</span>
        <span v-else-if="clearing.cartResult.postage !== null">邮费: {{ this.clearing.cartResult.postage }}</span>
      </p>
      <p @click="paymentControl">付款</p>
    </section>

    <!-- 付款选择 -->
    <section class="clearing-payment-way" :class="paymentWay?'active':''" @click="cancel">
      <article class="clearing-payment-wrap" @click="myfn">
        <h2>选择付款方式</h2>
        <p :class="{ 'visited': isBalance, 'active': balance }" @click="balancePay">余额支付 <span>余额不足!</span> <i
          class="iconfont icon-gou"></i></p>
        <p :class="WeChatPay?'active':''" @click="WeChatFn">微信支付<i class="iconfont icon-gou"></i></p>
        <p @click="cancel">取消</p>
        <p @click="paymentHint" :class="{'active': flag}">立即付款</p>
      </article>
    </section>

    <!-- 验证提示 -->
    <div class="invoice-reminder" :class="reminder?'active':''">
      {{ msg }}
    </div>
  </div>
</template>

<script>
	import { postData, getData, apiUrl, toast, paymentJjump } from "@/constant/api";
	import { mapMutations, mapGetters } from "vuex";

	export default {
		data() {
			return {
				resultData: {}, // 当前渲染页面内容的数据
				clearing: {}, // 结算页面的总数据
				paymentWay: false, // 付款的盒子
				balance: false, // 余额
				WeChatPay: false, // 微信支付
				isBalance: false, // 判断余额是否够
				invoice: {
					// 结算发票信息
					materialType: "", // 否	String	类型 0：纸质发票 1：电子发票
					invoiceType: "", // 否	String	发票类型 1普通发票 2增值税发票
					unitName: "", // 否	String	单位 个人
					invoiceTitle: "", // 否	String	单位 个人 发票抬头
					invoiceContent: "", // 否	String	发票内容
					telephoneRegistration: "", // 否	String	注册电话
					registeredAddress: "" // 否	String	注册邮箱
				},
				deduction: {
					// 优惠卷抵扣
					num: 0,
					id: 0
				},
				portSelect: "", // 用于接口判断是从哪个页面进来，以便调用对应的接口
				rental: 0, // 总额
				orderData: {}, // 存放请求的 立即购买 以及 购物车购买的 结算返回数据
				msg: "", // 提示文字
				reminder: false, // 提示开关
				flag: false, // 支付开关
			};
		},
		// 计算属性
		computed: {
			sum() {
				let num = 0;
				if(this.deduction.num != 0) {
					if(this.deduction.num >= this.clearing.cartResult.totalPrice) {
						num = 0;
					} else {
						num = this.clearing.cartResult.totalPrice - this.deduction.num;
					}
				} else {
					num = this.clearing.cartResult.totalPrice;
				}
				this.rental = num.toFixed(2);
				return num.toFixed(2);
			}
		},
		methods: {
			// 设置vuex的数据
			...mapMutations({
				setShoppingData: "SET_SHOPPINGDATA",
				shoppingId: "SET_SHOPPINGID",
				setShopCartNum: "SET_SHOPCARTNUM"
			}),
			// 返回上一页
			back() {
				this.$router.back();
				localStorage.removeItem("InvoiceInfo"); // 删除发票信息
				localStorage.removeItem("clearingData"); // 删除购物车数据
				localStorage.removeItem("clearingSite"); // 删除地址信息
				localStorage.removeItem("deduction"); // 删除优惠卷金额
			},
			// 组织冒泡
			myfn(e) {
				window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
			},
			// 控制付款盒子出现
			paymentControl() {
				if(JSON.parse(localStorage.getItem("clearingSite")).addressId != 0) {
					// 第一步校验是否选择地址
					if(this.rental > 0) {
						// 判断当前支付金额是否大于零
						postData(apiUrl().findMemberInfo).then(response => {
							// 请求个人信息接口判断余额
							if(response.status == 200) {
								// console.log(response, '余额 对比,个人信息')
								// console.log(response.result.availablePredeposit, '余额 对比,个人信息', this.rental)
								if(this.rental <= response.result.availablePredeposit) {
									// 对比是否余额足够支付
									this.isBalance = false; // 余额不够 判断成立
								} else {
									this.isBalance = true; // 余额充足
								}
								this.paymentWay = !this.paymentWay;
								this.banSliding(); // 判断是否禁止滑动
							}
						});
					} else {
						// 当支付金额不大于零的时候
						this.msg = "金额异常,该商品无法使用优惠券,请返回重新挑选商品!"; // 提示文字
						if(this.reminder == false) {
							// 判断打开提示
							this.reminder = true;
						}
						setTimeout(() => {
							this.reminder = false; // 关闭提示
						}, 2000);
					}
				} else {
					this.msg = "请先选择或新增地址!"; // 提示文字
					if(this.reminder == false) {
						// 判断打开提示
						this.reminder = true;
					}
					setTimeout(() => {
						this.reminder = false; // 关闭提示
					}, 2000);
				}
			},
			//实现滚动条无法滚动
			mo(e) {
				e.preventDefault();
			},
			// 禁止页面滑动
			stop() {
				document.body.style.overflow = "hidden";
				document.addEventListener("touchmove", this.mo, false);
			},
			//取消滑动限制出现滚动条
			move() {
				document.body.style.overflow = "";
				document.removeEventListener("touchmove", this.mo, false);
			},
			// 禁止滑动
			banSliding() {
				if(this.paymentWay) {
					// 当出现付款盒子的时候
					this.stop(); // 禁止页面滚动
					console.log("禁止页面滚动");
				} else {
					this.move(); // 允许页面滚动
					console.log("允许页面滚动");
				}
			},
			// 取消付款
			cancel() {
				this.paymentWay = !this.paymentWay;
				this.balance = false;
				this.WeChatPay = false;
				this.banSliding(); // 判断是否禁止滑动

				/*
				          setTimeout(() => {
				              this.$router.push({path: `/order/0`})
				          },800)
				          */
			},
			// 选择余额支付
			balancePay() {
				if(this.isBalance) {
					this.balance = false;
				} else {
					this.WeChatPay = false; // 让微信支付取消
					this.balance = true; // 余额支付成功
				}
			},
			// 选择微信支付
			WeChatFn() {
				if(this.balance) {
					this.balance = false;
				}
				this.WeChatPay = true;
			},
			// 跳转结算付款页面
			paymentHint() {
				// 判断余额支付 与 微信支付是否已选择
				if(this.balance || this.WeChatPay) {
					if(!this.flag) {
						// 判断选择支付方式
						if(this.portSelect == 0) {
							// console.log('立即购买结算');
							this.buyAsk();
						} else if(this.portSelect == 1) {
							// console.log('购物车结算');
							this.cartAsk();
						}
					} else {
						toast(this, "请不要重复提交订单!");
					}
					this.flag = true;
				} else {
					toast(this, "请选择付款方式!");
				}
			},
			// 去地址选择页面
			toSelectionSite() {
				this.$router.push({
					path: `/selection-site`
				});
			},
			// 從localStorage 中獲取請求回來的數據
			getClearingData() {
				// 获取所有的页面内容数据
				if(localStorage.getItem("clearingData") !== null) {
					let data = {};
					data = JSON.parse(localStorage.getItem("clearingData"));
					// console.log(data,'從localStorage 中獲取請求回來的數據');
					// 结算页面的所有数据
					this.clearing = data;

					// 获取页面详细内容数据
					this.resultData = data.cartResult.cartVoList[0].cartList;

					// 判断哪个页面进来的
					if(data.type == 1) {
						console.log("购物车结算");
						this.portSelect = 1;
					} else if(data.type == 0) {
						console.log("立即购买结算");
						this.portSelect = 0;
					}
					// console.log(this.resultData)
				}

				// 获取结算页地址数据
				// console.log(localStorage.getItem('clearingSite'))
				if(localStorage.getItem("clearingSite") !== null) {
					this.clearingSite = JSON.parse(localStorage.getItem("clearingSite"));
				}

				// 从发票页面拿到发票数据
				// console.log(localStorage.getItem('InvoiceInfo'))
				if(localStorage.getItem("InvoiceInfo") !== null) {
					this.invoice = JSON.parse(localStorage.getItem("InvoiceInfo"));
				}

				// 从缓存中拿到优惠卷金额
				// console.log(localStorage.getItem('deduction'), '从缓存中拿到优惠卷金额')
				if(localStorage.getItem("deduction") !== null) {
					this.deduction = JSON.parse(localStorage.getItem("deduction"));
				}
			},
			// 购物车请求
			cartAsk() {
				let data = {
					couponId: [], // 否	Long[]	优惠券id
					addressId: 0, // 是	Long	地址ID
					pay_name: "", // 是	String	wxpay 微信支付 online 余额支付(没有可用余额时无法请求该接口)
					cardId: [] // 是	Long[]	购物车id
				};
				// 优惠券id
				if(localStorage.getItem("deduction") != null && localStorage.getItem("deduction").indexOf("id") != -1 && JSON.parse(localStorage.getItem("deduction")).id != 0){
					data.couponId.push(JSON.parse(localStorage.getItem("deduction")).id);
					console.log('有优惠券!')
				} else {
					delete data.couponId;
					console.log('无优惠券!')
				}
				// 地址ID
				if(localStorage.getItem("clearingSite") != null) {
					data.addressId = JSON.parse(localStorage.getItem("clearingSite")).addressId;
					console.log(data.addressId);
				}
				// wxpay 微信支付 online 余额支付    微信支付 this.WeChatPay 余额支付 this.balance
				if(this.WeChatPay) {
					data.pay_name = "wxpay";
				} else if(this.balance) {
					data.pay_name = "online";
				}
				// 购物车ID
				if(localStorage.getItem("clearingData") != null) {
					let box = JSON.parse(localStorage.getItem("clearingData")).cartResult
						.cartVoList[0].cartList;
					box.forEach((e, i) => {
						data.cardId.push(e.cardId);
					});
				}
				// 发票信息
				if(localStorage.getItem("InvoiceInfo") != null) {
					let InvoiceDatum = JSON.parse(localStorage.getItem("InvoiceInfo"));
					data.materialType = InvoiceDatum.materialType; // 否	String	类型 0：纸质发票 1：电子发票
					data.invoiceType = InvoiceDatum.invoiceType; // 否	String	发票类型1普通发票2增值税发票
					data.unitName = InvoiceDatum.unitName; // 否	String	单位 个人
					data.invoiceTitle = InvoiceDatum.invoiceTitle; // 否	String	单位 个人 发票抬头
					data.invoiceContent = InvoiceDatum.invoiceContent; // 否	String	发票内容
					data.telephoneRegistration = InvoiceDatum.telephoneRegistration; // 否	String	注册电话
					data.registeredAddress = InvoiceDatum.registeredAddress; // 否	String	注册邮箱
				}
				postData(apiUrl().addCartOrder, data).then(response => {
					if(response.status == 200) {
						console.log(
							response,
							"购物车结算",
							"微信支付",
							this.WeChatPay,
							"余额支付",
							this.balance
						);
						// wxpay 微信支付 online 余额支付    微信支付 this.WeChatPay 余额支付 this.balance
						if(this.WeChatPay) {
							this.orderData = response.result;
							console.log(this.orderData, "this.orderData");
							console.log("微信支付");
							this.prePay(); //  成功之后调支付接口
						} else if(this.balance) {
							console.log("余额支付!");
							this.paymentWay = !this.paymentWay; // 关闭支付界面
							this.move(); // 允许页面滚动
							console.log("允许页面滚动");
							this.setShopCartNum(Math.random()); // 每次到这一步的时候重新请求购物车列表的数据
							this.$router.push({
								path: `/payment-hint`
							}); // 跳转支付成功页面
						}
					} else if(response.status == 400) {
						console.log("购物车结算生成订单失败!");
						toast(this, "库存不足,购物车结算失败！");
					}
				});
			},
			// 立即购买请求
			buyAsk() {
				let data = {
					addressId: 0, // 是	Long	地址ID
					pay_name: "", // 是	String	wxpay 微信支付 online 余额支付(没有可用余额时无法请求该接口)
					num: 0, // 是	Integer	购买数量
					productId: 0 // 是	Long	商品id
				};

				// 优惠券id
				if(localStorage.getItem("deduction") != null && localStorage.getItem("deduction").indexOf("id") != -1 && JSON.parse(localStorage.getItem("deduction")).id != 0){
					data.couponId = new String();
					data.couponId = JSON.parse(localStorage.getItem("deduction")).id;
					console.log('有优惠券!')
				}
				// 地址ID
				if(localStorage.getItem("clearingSite") != null) {
					data.addressId = JSON.parse(
						localStorage.getItem("clearingSite")
					).addressId;
					console.log(data.addressId);
				}
				// wxpay 微信支付 online 余额支付    微信支付 this.WeChatPay 余额支付 this.balance
				if(this.WeChatPay) {
					data.pay_name = "wxpay";
				} else if(this.balance) {
					data.pay_name = "online";
				}
				// 购买数量
				if(localStorage.getItem("clearingData") != null) {
					let box = JSON.parse(localStorage.getItem("clearingData")).cartResult
						.cartVoList[0];
					data.num = box.num; // 购买数量
					data.productId = box.cartList[0].productId; // 商品id
					if(box.cartList[0].skuId != 0 && box.cartList[0].skuId != null) {
						// skuId
						data.skuId = box.cartList[0].skuId; // 是 Long	商品库存id 回传  （结算页为0 或者 null不传）
					}
				}
				// 发票信息
				if(localStorage.getItem("InvoiceInfo") != null) {
					let InvoiceDatum = JSON.parse(localStorage.getItem("InvoiceInfo"));
					data.materialType = InvoiceDatum.materialType; // 否	String	类型 0：纸质发票 1：电子发票
					data.invoiceType = InvoiceDatum.invoiceType; // 否	String	发票类型1普通发票2增值税发票
					data.unitName = InvoiceDatum.unitName; // 否	String	单位 个人
					data.invoiceTitle = InvoiceDatum.invoiceTitle; // 否	String	单位 个人 发票抬头
					data.invoiceContent = InvoiceDatum.invoiceContent; // 否	String	发票内容
					data.telephoneRegistration = InvoiceDatum.telephoneRegistration; // 否	String	注册电话
					data.registeredAddress = InvoiceDatum.registeredAddress; // 否	String	注册邮箱
				}
				postData(apiUrl().addOrder, data).then(response => {
					if(response.status == 200) {
						console.log(
							response,
							"立即购买结算",
							"微信支付",
							this.WeChatPay,
							"余额支付",
							this.balance
						);
						// wxpay 微信支付 online 余额支付    微信支付 this.WeChatPay 余额支付 this.balance
						if(this.WeChatPay) {
							this.orderData = response.result;
							console.log(this.orderData, "this.orderData");
							this.prePay(); //  成功之后调支付接口
							console.log("微信支付");
						} else if(this.balance) {
							console.log("余额支付!");
							this.paymentWay = !this.paymentWay; // 关闭支付界面
							this.move(); // 允许页面滚动
							console.log("允许页面滚动");
							this.setShopCartNum(Math.random()); // 每次到这一步的时候重新请求购物车列表的数据
							this.$router.push({
								path: `/payment-hint`
							}); // 跳转支付成功页面
						}
					} else if(response.status == 400) {
						console.log("立即购买结算生成订单失败!");
						toast(this, "库存不足,立即购买购物车结算失败！");
					}
				});
			},
			// 支付接口
			prePay() {
				console.log("到达微信支付");
				this.setShopCartNum(Math.random()); // 每次到这一步的时候重新请求购物车列表的数据
				let data = {};
				// 余额 充值的时候 只传price 订单支付的时候传orderId 如果是购物车下单直接支付 传orderId 和 paySign 其中价钱是必传的
				// wxpay 微信支付 online 余额支付    微信支付 this.WeChatPay 余额支付 this.balance
				const sum = arr => {
					let num = 0;
					for(var i = 0; i < arr.length; i++) {
						num += arr[i].orderAmount;
					}
					return num;
				};
				console.log(this.orderData, "输出微信支付时获取到的数组数据!");
				data.price = sum(this.orderData); // price	    是		金额
				data.orderId = this.orderData[0].orderId; // orderId	否		订单ID 看api说明
				data.paySign = this.orderData[0].paySn; // paySign	否		订单交易号 看api说明

				postData(apiUrl().prePay, data).then(response => {
					if(response.status == 200) {
						console.log(response, "微信支付结果!");
						if(
							response.result != "" ||
							response.result != undefined ||
							response.result != null
						) {
							// 调用微信内容ajax 传参 支付
							this.ultimatePayment(response.result);
						}
					} else {
						console.log(response, "微信支付结果!", "支付出错!");
					}
				});
			},
			// 调微信自带付款页面
			ultimatePayment(data) {
				let selfThis = this;
				const jsApiCall = data => {
						WeixinJSBridge.invoke(
							"getBrandWCPayRequest", {
								appId: data.appId, // 公众号名称，由商户传入
								timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
								nonceStr: data.nonceStr, // 随机串
								package: data.package,
								signType: data.signType, // 微信签名方式：
								paySign: data.paySign //微信签名
							},
							// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
							function(res) {
								selfThis.resultPay(res); //   调用微信支付结果返回方法
							}
						);
					},
					callpay = data => {
						if(typeof WeixinJSBridge == "undefined") {
							if(document.addEventListener) {
								document.addEventListener(
									"WeixinJSBridgeReady",
									jsApiCall(data),
									false
								);
							} else if(document.attachEvent) {
								document.attachEvent("WeixinJSBridgeReady", jsApiCall(data));
								document.attachEvent("onWeixinJSBridgeReady", jsApiCall(data));
							}
						} else {
							jsApiCall(data);
						}
					};
				// https://download.sublimetext.com/Sublime%20Text%20Build%203143%20x64%20Setup.exe
				// https://download.sublimetext.com/Sublime%20Text%20Build%203143%20x64.zip
				callpay(data); // 调用支付!
			},
			resultPay(res) {
				if(res.err_msg == "get_brand_wcpay_request:ok") {
					this.paymentWay = false; // 关闭支付界面
					this.move();
					this.$router.push({
						path: `/payment-hint`
					});
				} else if(res.err_msg == "get_brand_wcpay_request:cancel") {
					this.paymentWay = false; // 关闭支付界面
					this.move();
					toast(this, "您已取消支付");
					setTimeout(() => {
						this.$router.push({
							path: `/order/0`
						});
					}, 500);
				} else if(res.err_msg == "get_brand_wcpay_request:fail") {
					this.paymentWay = false; // 关闭支付界面
					this.move();
					toast(this, "支付失败");
					setTimeout(() => {
						this.$router.push({
							path: `/order/0`
						});
					}, 500);
				}
			}
			// toSucceed() {
			//   this.paymentWay = false; // 关闭支付界面
			//   //              this.$router.push({path: `/payment-hint`})
			//   //                window.location.href="http://www.yylmly.com/payment-hint";
			//   paymentJjump("payment-hint");
			// },
			// toOrder() {
			//   this.paymentWay = false; // 关闭支付界面
			//   //                this.$router.push({path: `/order/0`})       // 去全部订单页面
			//   //                window.location.href="http://www.yylmly.com/order/0";
			//   paymentJjump("order/0");
			// }
		},
		components: {},
		created() {
			// console.log(this.shoppingId)
			// 请求页面数据, 渲染页面 以及算出总价格
			this.getClearingData(); // 获取数据
			/*
			        let data = {};
			        data = JSON.parse(localStorage.getItem("clearingData"));
			        console.log(data,'從localStorage 中獲取請求回來的數據');

			        // 结算页优惠卷抵扣
			        console.log(data.cartResult.cartVoList[0].fillMoney);
			        */
		},
		// 动态监听
		watch: {
			$route(n) {
				// 做首页跳到当前页面做滚动
				//                this.urlNum = this.$route.query.item
				//                if (this.urlNum !== undefined) {
				//                    // console.log(this.urlNum)
				//                }
				this.getClearingData(); // 获取数据
				this.paymentWay = false; // 关闭支付界面
				this.balance = false; // 选择余额
				this.WeChatPay = false; // 选择微信支付
				this.flag = false;
			}
		}
	};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
	@import "src/assets/scss/common";
	.clearing-container {
		@include size(100%, auto);
		margin: 0 auto;
		@include box-sizing;
		.return {
			position: $fixed;
			top: 0;
			left: 0;
			display: inline-block;
			@include size(80px, 88px);
			text-align: center;
			float: left;
			z-index: 100;
			i.iconfont.icon-zuo {
				@include font(40px, 88px, normal, center, #fff);
			}
		}
	}

	// 地址
	.clearing-site {
		@include size(100%, auto);
		margin: 0 0 20px 0;
		background: #fff;
		@include box-sizing;
		padding: 26px 30px 20px;
		position: $rela;
		p:nth-of-type(1) {
			@include size(640px, 58px);
			@include font(30px, 58px, normal, left, #333);
			@include text-over;
			span:nth-of-type(1) {
				margin: 0 20px 0 0;
			}
		}
		p:nth-of-type(2) {
			@include size(640px, auto);
			@include font(26px, 56px, normal, left, #666);
		}
		p:nth-of-type(3) {
			@include size(80px, 80px);
			@include font(32px, 80px, normal, center, #aaa);
			position: $abso;
			top: 0;
			bottom: 0;
			right: 0;
			margin: auto 0;
		}
	}

	// 内容
	.clearing-con {
		@include size(100%, auto);
		margin: 0 auto;
		.clearing-con-list {
			@include size(100%, auto);
			padding: 0 30px 0 30px;
			@include box-sizing;
			margin: 0 0 20px 0;
			background: #fff;
		}
		.clearing-con-pic {
			@include size(220px, 220px);
			float: left;
			margin: 10px 0;
			overflow: hidden;
			img {
				display: block;
				@include size(100%, auto);
			}
		}
		.clearing-con-wrap {
			@include size(470px, 240px);
			float: right;
			.clearing-con-title {
				@include size(100%, auto);
				@include font(28px, 60px, normal, left, #333);
				@include txtover(2);
				margin: 10px 0 10px 0;
			}
			.clearing-con-msg {
				@include size(100%, 46px);
				@include font(24px, 46px, normal, left, #999);
				@include text-over;
			}
			.clearing-con-price {
				@include size(100%, 65px);
				@include text-over;
				p:nth-of-type(1) {
					@include size(70%, 65px);
					float: left;
					@include font(26px, 65px, normal, left, #f0555a);
					span {
						font-size: 18px;
					}
				}
				p:nth-of-type(2) {
					@include size(30%, 65px);
					float: right;
					@include font(26px, 65px, normal, right, #999);
				}
			}
		}
		.clearing-con-tag {
			@include size(100%, 93px);
			border-top: 1px solid #ddd;
			float: left;
			p {
				height: 32px;
				padding: 0 20px;
				@include font(20px, 30px, normal, center, #8ec25a);
				float: left;
				border: 2px solid #8ec25a;
				@include box-sizing;
				border-radius: 20px;
				margin: 30px 10px 0 0;
			}
		}
	}

	// 优惠卷 发票
	.clearing-list-wrap {
		@include size(100%, auto);
		margin: 0 auto;
		.clearing-list {
			@include size(100%, 100px);
			margin: 0 auto 20px;
			background: #fff;
			@include box-sizing;
			padding: 0 80px 0 30px;
			@include font(24px, 100px, normal, left, #333);
			position: $rela;
			.label {
				@include size(146px, 100px);
				float: left;
			}
			.con {
				@include size(490px, 100px);
				float: left;
				text-align: right;
				color: #666;
			}
			.icon {
				@include size(80px, 100px);
				position: $abso;
				top: 0;
				right: 0;
				bottom: 0;
				margin: auto 0;
				text-align: center;
				color: #aaa;
			}
		}
	}

	// 合计付款
	.clearing-foot-payment {
		@include size(100%, 100px);
		position: $fixed;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
		background: #fff;
		z-index: 50;
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.8);
		@include box-sizing;
		padding: 0 30px;
		@include font(28px, 100px, normal, left, #666);
		p:nth-of-type(1) {
			@include size(80%, 100px);
			float: left;
			span:nth-of-type(1) {
				margin-right: 10px;
			}
			span:nth-of-type(2) {
				font-size: 26px;
				color: #f0555a;
				margin-right: 10px;
			}
			span:nth-of-type(3) {
				font-size: 26px;
				color: #999;
			}
		}
		p:nth-of-type(2) {
			@include size(20%, 72px);
			float: right;
			border-radius: 32px;
			@include font(28px, 72px, normal, center, #fff);
			background: #99cc66;
			margin-top: 14px;
		}
	}

	// 付款方式
	.clearing-payment-way {
		@include size(100%, 100%);
		position: $fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: -200%;
		margin: auto;
		z-index: 100;
		background: rgba(0, 0, 0, 0.8);
		transition: all 0.1s ease-in-out;
		.clearing-payment-wrap {
			@include size(690px, 480px);
			position: $abso;
			top: -200%;
			right: 0;
			bottom: 0;
			left: 0;
			margin: auto;
			background: #fff;
			border-radius: 10px;
			@include box-sizing;
			padding: 9px 30px 58px;
			transition: all 0.6s ease-out;
			h2 {
				@include size(100%, 91px);
				@include font(28px, 90px, normal, center, #000);
			}
			p:nth-of-type(1),
			p:nth-of-type(2) {
				@include size(100%, 100px);
				@include font(24px, 100px, normal, left, #666);
				@include box-sizing;
				padding: 0 60px 0 0;
				position: $rela;
				border-bottom: 1px solid #ddd;
				i {
					display: inline-block;
					@include size(40px, 40px);
					@include box-sizing;
					border: 2px solid #acacac;
					color: #fff;
					border-radius: 50%;
					position: $abso;
					top: 0;
					right: 0;
					bottom: 0;
					margin: auto 0;
					background: #fff;
					transtion: all 0.2s linear;
					@include font(36px, 40px, normal, center, #fff);
				}
				span {
					float: right;
					color: #fff;
				}
			}
			p:nth-of-type(1).active,
			p:nth-of-type(2).active {
				i {
					background: #8ec25a;
					border: 2px solid #8ec25a;
				}
			}
			p:nth-of-type(1).visited {
				span {
					color: #f0555a;
				}
			}
			p:nth-of-type(4),
			p:nth-of-type(3) {
				@include size(300px, 80px);
				margin: 40px 0 0 0;
				border-radius: 60px;
				@include font(26px, 80px, normal, center, #fff);
				border: 2px solid #8ec25a;
				background: #8ec25a;
			}
			p:nth-of-type(3) {
				float: left;
				color: #999;
				border: 2px solid #aaa;
				background: #fff;
			}
			p:nth-of-type(4) {
				float: right;
			}
			p:nth-of-type(4).active {
				color: #fff;
				background: #ccc;
				border-color: #ccc;
			}
		}
	}

	.clearing-payment-way.active {
		left: 0;
		.clearing-payment-wrap {
			top: 0;
		}
	}

	// 提示框
	.invoice-reminder {
		@include size(470px, 120px);
		background: #fff;
		position: $fixed;
		top: -200%;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		z-index: 100;
		transition: all 0.2s ease;
		border-radius: 12px;
		-webkit-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, 0.2);
		-moz-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, 0.2);
		box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, 0.2);
		@include font(28px, 120px, normal, center, #fff);
		@include box-sizing;
		background: rgba(0, 0, 0, 0.6);
	}

	.invoice-reminder.active {
		top: 0;
	}
</style>
