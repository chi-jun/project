<template>
	<div class="header" v-show="personal">
		<section class="header-wrap" v-show="!searchHistory">
			<!-- 首页地址左 -->
			<p class="head-site-left left" v-show="index">
				<i class="iconfont icon-dizhi"></i>
				<span>
                    {{ site }}
                </span>
			</p>

			<!-- 商品详情左-->
			<p class="return goods-details" v-if="goodsDetails" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 结算页面左
            <p class="return" v-if="clearing" @click="back">
                <i class="iconfont icon-zuo"></i>
            </p>
             -->
			<!-- 结算地址选择 -->
			<p class="return" v-if="selectionSite" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 发票选择 -->
			<p class="return" v-if="invoice" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 结算选择优惠卷 -->
			<p class="return" v-if="paymentCoupons" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 个人资料  -->
			<p class="return" v-if="personalData" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 地址管理  -->
			<p class="return" v-if="address" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 地址编辑 -->
			<p class="return" v-if="editAddress" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 联系客服 -->
			<p class="return" v-if="notescontact" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 新增地址 -->
			<p class="return" v-if="addAddress" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 我的订单 -->
			<p class="return" v-if="order" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 物流详情 -->
			<p class="return" v-if="logistics" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 申请退款 -->
			<p class="return" v-if="refund" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 订单评价 -->
			<p class="return" v-if="evaluate" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 优惠卷 -->
			<p class="return" v-if="coupons" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 我的收藏 -->
			<p class="return" v-if="collect" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 余额 -->
			<p class="return" v-if="balance" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 个人中心 充值 -->
			<p class="return" v-if="recharge" @click="back">
				<i class="iconfont icon-zuo"></i>
			</p>
			<!-- 结算提示  -->
			<p class="return" v-if="paymentHint" @click="backToHome">
				<i class="iconfont icon-zuo"></i>
			</p>

			<!--
            <a href="" class="head-left" v-if="index">
                <i class="iconfont icon-dizhi"></i>
                {{ site }}
            </a>
             -->
			<!-- 共用页面顶部 -->
			<h1 class="head-con" v-html="headlines"></h1>
			<!-- 首页 及 选购页 右 -->
			<a @click="setCurrentPage" class="head-right" v-show="searchLink">
				<i class="iconfont icon-sousuo"></i>
			</a>

			<!-- 商品详情右 -->
			<p class="head-site-right right" v-show="goodsDetails">
				<i class="iconfont icon-dizhi"></i>
				<span>
                    {{ site }}
                </span>
			</p>
		</section>
		<!-- 搜索历史 -->
		<section class="header-wrap" v-show="searchHistory">
			<p class="return" @click="backSearch">
				<i class="iconfont icon-zuo"></i>
			</p>
			<form @submit.prevent="search" class="search-history-wrap">
				<p class="iconfont-wrap">
					<i class="iconfont icon-sousuo"></i>
				</p>
				<input type="text" class="search-history-text" v-model.trim="searchVal" v-show="searchHistory" @click="goHistory">
				<p class="search-history-btn" @click="search">搜索</p>
			</form>
		</section>
	</div>
</template>

<script>
	import { postData, getData, apiUrl } from "@/constant/api";

	export default {
		data() {
			return {
				headTitle: "首页",
				site: "正在获取中...",
				index: true, // 判断是否是首页
				searchHistory: false, // 判断是否是搜索历史页
				searchResult: false, // 判断是否是搜索结果页
				searchVal: "", // 绑定搜索的参数
				chooseList: false, // 绑定是否是商品列表页
				searchLink: false, // 首页和选购页 跳转搜索的链接
				personal: true, // 个人中心首页
				shop: false, // 购物车页面
				clearing: false, // 结算
				paymentHint: false, // 结算提示
				goodsDetails: false, // 商品详情
				selectionSite: false, // 结算页商品地址选择
				invoice: false, // 发票选择
				paymentCoupons: false, // 结算选择优惠卷
				personalData: false, // 个人资料
				address: false, // 个人中心 地址管理
				editAddress: false, // 地址编辑
				notescontact: false, // 联系客服
				addAddress: false, // 新增地址
				order: false, // 我的订单
				logistics: false, // 物流详情
				refund: false, // 申请退款
				evaluate: false, // 订单评价
				coupons: false, // 优惠卷
				collect: false, // 我的收藏
				balance: false, // 余额
				recharge: false, // 充值
				headline: {
					首页: "首页",
					选购: "选购",
					选购详情: "选购",
					购物车: "购物车",
					个人中心: "个人中心",
					搜索历史: "搜索历史",
					商品详情: "商品详情",
					商品详情id: "商品详情",
					规格库存id: "商品详情",
					结算: "结算",
					结算页面: "结算",
					结算提示: "付款成功",
					结算地址选择: "地址选择",
					结算发票: "设置发票信息",
					发票选择: "设置发票信息",
					结算优惠卷: "使用优惠卷",
					结算优惠卷选择: "使用优惠卷",
					个人资料: "个人资料",
					个人资料子页面: "个人资料",
					地址管理: "地址管理",
					地址管理页面: "地址管理",
					地址编辑: "地址编辑",
					地址编辑页面: "地址编辑",
					联系客服: "联系客服",
					添加新地址: "添加新地址",
					添加新地址页面: "添加新地址",
					我的订单: "我的订单",
					我的订单页面: "我的订单",
					订单详情: "订单详情",
					订单详情页面: "订单详情",
					订单详情子页面: "订单详情",
					物流详情: "物流详情",
					物流详情页面: "物流详情",
					申请退款: "申请退款",
					申请退款页面: "申请退款页面",
					评价: "评价",
					订单评价: "评价",
					优惠卷: "优惠卷",
					优惠卷页面: "优惠卷",
					我的收藏: "我的收藏",
					余额: "余额",
					余额页面: "余额",
					充值: "充值",
					充值页面: "充值"
				},
				currentPage: ""
			};
		},
		// 计算属性
		computed: {
			headlines() {
				// console.log(this.$route.path, this.headline)
				return this.headline[this.$route.name];
			}
		},
		methods: {
			refresh() {
				//获取路由参数
				let url = this.$route.path;
				// console.log(url)
				// 首页
				url === "/index" ? (this.index = true) : (this.index = false);
				// 首页和选购页的搜索按钮
				url === "/index" || url === "/choose" || url.substring(0, 7) === "/choose" ?
					(this.searchLink = true) :
					(this.searchLink = false);
				// console.log(url.substring(0,14)+' $$ '+ this.goodsDetails)
				// 搜索历史 以及 搜索结果 以及 商品列表
				url === "/searchHistory" ||
					url.substring(0, 13) === "/searchResult" ||
					url.substring(0, 12) === "/choose-list" ?
					(this.searchHistory = true) :
					(this.searchHistory = false);
				// 个人中心
				url === "/personal" ? (this.personal = false) : (this.personal = true);
				// 商品详情页
				url.indexOf('/goods-details') !== -1 ? this.goodsDetails = true : this.goodsDetails = false;
				// 结算页  结算地址选择
				if(
					url.substring(0, 9) === "/clearing" ||
					url.substring(0, 5) === "/selection-site"
				) {
					this.clearing = true;
				} else {
					this.clearing = false;
				}
				// 结算提示页
				url.substring(0, 13) === "/payment-hint" ?
					(this.paymentHint = true) :
					(this.paymentHint = false);
				// 结算地址选择
				url.substring(0, 15) === "/selection-site" ?
					(this.selectionSite = true) :
					(this.selectionSite = false);
				// 设置发票选择页面
				url.substring(0, 8) === "/invoice" ?
					(this.invoice = true) :
					(this.invoice = false);
				// 设置结算选择优惠卷
				url.substring(0, 16) === "/payment-coupons" ?
					(this.paymentCoupons = true) :
					(this.paymentCoupons = false);
				// 个人中心 个人资料
				url.substring(0, 14) === "/personal-data" ?
					(this.personalData = true) :
					(this.personalData = false);
				// 个人中心 地址管理
				url.substring(0, 8) === "/address" ?
					(this.address = true) :
					(this.address = false);
				// 个人中心 地址编辑
				url.substring(0, 13) === "/edit-address" ?
					(this.editAddress = true) :
					(this.editAddress = false);
				// 个人中心 联系客服
				url.substring(0, 13) === "/notescontact" ?
					(this.notescontact = true) :
					(this.notescontact = false);
				// 个人中心 新增地址
				url.substring(0, 12) === "/add-address" ?
					(this.addAddress = true) :
					(this.addAddress = false);
				// 个人中心 我的订单
				url.indexOf("/order") != -1 ? (this.order = true) : (this.order = false);
				// 个人中心 物流详情
				url.substring(0, 10) === "/logistics" ?
					(this.logistics = true) :
					(this.logistics = false);
				// 个人中心 申请退款
				url.substring(0, 7) === "/refund" ?
					(this.refund = true) :
					(this.refund = false);
				// 个人中心 订单评价
				url.substring(0, 9) === "/evaluate" ?
					(this.evaluate = true) :
					(this.evaluate = false);
				// 个人中心 优惠卷
				url.substring(0, 8) === "/coupons" ?
					(this.coupons = true) :
					(this.coupons = false);
				// 个人中心 我的收藏
				url.substring(0, 8) === "/collect" ?
					(this.collect = true) :
					(this.collect = false);
				// 个人中心 余额
				url.substring(0, 8) === "/balance" ?
					(this.balance = true) :
					(this.balance = false);
				// 个人中心 充值
				url.substring(0, 9) === "/recharge" ?
					(this.recharge = true) :
					(this.recharge = false);
			},
			// 返回上一页
			back() {
				this.$router.back();
			},
			// 搜索页的返回
			backSearch() {
				if(this.currentPage) {
					this.$router.push(this.currentPage);
				} else {
					this.$router.back();
				}
			},
			// 设置当前的页面
			setCurrentPage() {
				this.currentPage = this.$route.path;
				this.$router.push({
					path: `/searchHistory`
				});
			},
			// 返回首页
			backToHome() {
				this.$router.push({
					path: `/index`
				});
			},
			// 提交
			search() {
				if(!this.searchVal) {
					return;
				} else {
					this.$router.push({
						path: `/searchResult/${this.searchVal}`
					});
				}
			},
			// 去历史页
			goHistory() {
				this.$router.push({
					path: `/searchHistory`
				});
			},
			// 获取 jsapi配置  getWxConfig
			getWxConfig() {
				// console.log(window.location.href, window.location.href.split("#")[0]);
				/*
				完整url可以用       window.location.href
				路由路径可以用       this.$route.path
				路由路径参数         this.$route.params
				获取路由参数         let url = this.$route.path
				*/

				const data = {};
				// data.url = '192.168.0.126:8080' + this.$route.path;
				// data.url = window.location.href.replace(/\/#/g, '');
				// data.url = window.location.href.split("#")[0];
				data.url = window.location.href;
				// console.log(data, '当前url');

				postData(apiUrl().getWxConfig, data).then(response => {
					// console.log(response, "成功请求回数据!");
					if(!response) {
						return;
					}
					if(response.status == 200) {
						//  console.log(response, response.status, "获取个人信息成功!");
						if(
							response.result != "" ||
							response.result != undefined ||
							response.result != null
						) {
							// 调用微信内容ajax 传参 支付
							this.getGeography(response.result);
						}
					} else if(
						response.status == 400 ||
						response.status == 500 ||
						response.status == 404
					) {
						//  console.log(response, response.status, "获取个人信息失败!");
					}
				});
			},
			// 微信获取地理位置 签名
			getGeography(data) {
				console.log("进入获取微信地理位置 签名");
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: data.appId, // 必填，公众号的唯一标识
					timestamp: data.timestamp, // 必填，生成签名的时间戳
					nonceStr: data.nonceStr, // 必填，生成签名的随机串
					signature: data.signature, // 必填，签名，见附录1
					jsApiList: [
						"openLocation", //使用微信内置地图查看地理位置接口
						"getLocation" //获取地理位置接口
					] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});

				wx.ready(function() {
					// 7 地理位置接口 开始
					// 7.1 查看地理位置
					/*
					wx.openLocation({
					    latitude: 23.099994,
					    longitude: 113.324520,
					    name: 'TIT 创意园',
					    address: '广州市海珠区新港中路 397 号',
					    scale: 14,
					    infoUrl: 'http://weixin.qq.com'
					});*/

					// 7.2 获取当前地理位置
					wx.getLocation({
						type: "wgs84",
						success: function(res) {
							console.log(JSON.stringify(res));

							// 地址解析:http://lbs.qq.com/javascript_v2/guide-service.html#link-four
							var geocoder = new qq.maps.Geocoder({
								complete: function(result) {
									console.log(result, "最后回调的数据");
									localStorage.current = result.detail.address; //保存result的详细地址信息
								}
							});
							geocoder.getAddress(
								new qq.maps.LatLng(res.latitude, res.longitude)
							);

							/*
							geocoder = new qq.maps.Geocoder({
							    complete: function(result){
							        alert('成功: '+result.detail.address);
							        this.site = result.detail.address;
							        console.log(result,  '最后回调的数据')
							    }
							});
							var coord = new qq.maps.LatLng(res.latitude, res.longitude);
							console.log(coord, '获取当前地理位置 经纬度');
							geocoder.getAddress(coord);
							 */
						},
						cancel: function(res) {
							console.log("用户拒绝授权获取地理位置");
						}
					});
					// 7 地理位置接口 结束
				});
				//初始化jsapi接口 状态
				wx.error(function(res) {
					console.log("调用微信jsapi返回的状态:" + res.errMsg);
				});
			},
			// 获取并处理当前地址
			getCurrent() {
				// localStorage.current = '中国广东省佛山市顺德区伦教镇北海村';
				if(localStorage.getItem('current') !== null) {
					let start = localStorage.getItem('current').indexOf('市'),
						end = localStorage.getItem('current').length,
						address = localStorage.getItem('current').slice(start + 1, end);
					console.log(address)
					this.site = address;
				}
			}
		},
		// 动态监听
		watch: {
			$route(n, o) {
				this.refresh(); // 根据url判断 顶部文字

				//获取路由参数
				let url = n.path;
				let oUrl = o.path;
				if(url === "/index" || url.substring(0, 14) === "/goods-details") {
					this.getWxConfig(); // 请求地址
					this.getCurrent(); // 获取并处理当前地址
				}
				// 当页面不是搜索结果页的时候清空搜索框内容
				// console.log(url, oUrl, "xjurl");
				if(oUrl.indexOf("/choose-list") !== -1 && url == "/searchHistory") {
					this.currentPage = oUrl;
				}
				if(url.indexOf("/choose-list") !== -1) {
					this.currentPage = "/choose";
				}
				if(url.indexOf("searchResult") == -1) {
					this.searchVal = "";
				}

			}
		},
		// 创建完毕之后 , 立即执行
		created() {
			this.refresh(); // 根据url判断 顶部文字
			this.getWxConfig(); // 请求地址
			this.getCurrent(); // 获取并处理当前地址
		}
	};
</script>

<style lang="scss" scoped>
	@import "src/assets/scss/common";
	// 顶部样式
	.header {
		width: 100%;
		height: 88px;
		background: #8ec25a;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 50;
		.header-wrap {
			@extend .header;
		}
	}
	
	.head-con {
		width: 574px;
		height: 88px;
		margin: 0 auto;
		@include font(32px, 88px, normal, center, #fff);
		// background: red;
	}
	
	.head-left,
	.head-right {
		display: block;
		width: 88px;
		height: 88px;
		position: absolute;
		top: 0;
		bottom: 0;
		text-align: center;
		line-height: 88px;
		color: #fff;
		.icon-sousuo {
			font-size: 46px !important;
		}
	}
	
	.head-site-left {
		display: block;
		/*width: 252px;*/
		width: 300px;
		height: 88px;
		position: absolute;
		top: 0;
		bottom: 0;
		text-align: center;
		line-height: 88px;
		color: #fff;
		span {
			display: inline-block;
			/*width: 184px;*/
			width: 232px;
			height: 88px;
			float: right;
			font-size: 20px;
			text-align: left;
			color: #fff;
			@include text-over;
		}
		.icon-dizhi {
			font-size: 28px !important;
		}
	}
	
	.head-site-right {
		@extend .head-site-left;
	}
	
	.head-site-left.left {
		left: 0;
	}
	
	.head-site-right.right {
		right: 0;
	}
	
	.head-left {
		left: 0;
	}
	
	.head-right {
		right: 0;
	}
	
	.head-left.nono,
	.head-right.none {
		display: none;
	}
	
	// 搜索页顶部
	.header-wrap {
		.return {
			display: inline-block;
			@include size(80px, 88px);
			text-align: center;
			float: left;
			i.iconfont.icon-zuo {
				@include font(40px, 88px, normal, center, #fff);
			}
		}
		.return.goods-details {
			position: fixed;
			z-index: 100;
			display: block;
		}
	}
	
	.search-history-wrap {
		display: inline-block;
		float: left;
		@include size(84%, 72px);
		@include box-sizing;
		border-radius: 72px;
		margin: 8px 0;
		background: #fff;
		overflow: hidden;
		padding: 0;
		text-align: left;
		.iconfont-wrap {
			display: inline-block;
			float: left;
			@include size(86px, 72px);
			text-align: center;
			i.iconfont.icon-sousuo {
				@include font(40px, 72px, normal, center, #aaa);
			}
		}
		.search-history-text {
			display: inline-block;
			float: left;
			@include size(433px, 32px);
			margin: 20px 0 0 0;
			border: 0;
			@include font(26px, 32px, normal, left, #333);
		}
		.search-history-btn {
			@include size(100px, 60px);
			float: right;
			background: #8ec25a;
			border-radius: 68px;
			margin: 6px 6px 0 0;
			@include font(26px, 60px, normal, center, #fff);
		}
	}
</style>