<template>
    <div class="address-container clearfix">
        <section class="address-wrap clearfix" v-for="(item, index) in resultData">
            <article class="address-info">
                <p>
                    <span>{{ item.trueName }}</span>
                    <span>{{ item.mobPhone }}</span>
                </p>
                <p>{{ item.areaInfo }} {{ item.address }}</p>
                <p>邮编{{ item.zipCode }} </p>
            </article>
            <div class="address-state">
                <p :class="{'active': item.isDefault == 1||resultData.length==1}" @click="checked(item, index)"><i class="iconfont icon-gou"></i><span>默认地址</span></p>
                <p @click="del(item,index, 1)"><i class="iconfont icon-shanchu"></i><span>删除</span></p>
                <!-- 编辑附带当前数据, 以及当前数据id -->
                <p @click="skipEdit(item, item.addressId)"><i class="iconfont icon-tubiao"></i><span>编辑</span></p>
            </div>
        </section>
        <div class="del-hint-wrap" :class="{'active': delHint}" @click="del(0,0,0)">
            <div class="del-hint-box" @click="myfn()">
                <h1>删除地址</h1>
                <p class="content">是否确认要删除该地址？</p>
                <p class="cancel" @click="del(0,0,0)">取消</p>
                <p class="delete" @click="confirmDel">删除</p>
            </div>
        </div>
        <router-link to="/add-address" tag="div" class="address-foot"><p>添加新地址</p></router-link>
    </div>
</template>

<script>
import { postData, getData, apiUrl } from "@/constant/api";
import { mapMutations, mapGetters } from "vuex";
export default {
  // 数据
  data() {
    return {
      resultData: [], // 存储初始化页面请求回来的数据
      delHint: false, // 删除提示
      delIndex: 0 // 删除索引
    };
  },
  // 方法
  methods: {
    // 设置vuex的数据
    ...mapMutations({
      setAddressList: "SET_ADDRESSLIST"
    }),
    // 组织冒泡
    myfn(e) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
    },
    // 设置选中设为默认
    checked(item, index) {
      this.myfn(); // 组织冒泡
      item.isDefault = 1;
      this.updateMyAddress(item);
    },

    // 修改地址
    updateMyAddress(data) {
      postData("/member/updateMyAddress", data).then(res => {
        if (res.status == 200) {
          this.findMyAddress(1);
        }
      });
    },
    // 删除当前 || 取消删除
    del(item, index, num) {
      if (num == 0) {
        this.move(); // 允许屏幕进行滚动
        this.delHint = false; //
      } else if (num == 1) {
        this.stop(); // 禁止页面滚动
        this.delHint = true; // 出现删除提示框
        this.delIndex = index; // 存储需要删除的索引
        this.addressId = item.addressId; // 地址的索引id
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
    // 删除地址请求
    deleteMyAddress(ids) {
      let data = {
        ids: ids
      };
      postData("/member/deleteMyAddress", data).then(res => {
        console.log(res);
      });
    },
    // 确认删除
    confirmDel() {
      this.del(0, 0, 0);
      this.resultData.splice(this.delIndex, 1); // 操作属性
      this.setAddressList(JSON.stringify(this.resultData)); // 给vuex赋值
      this.deleteMyAddress(this.addressId);

    },
    // 跳转编辑页面
    skipEdit(item, id) {
      this.$router.push({ path: `/edit-address/${id}` });
    },
    // 请求地址
    findMyAddress(pageNo) {
      let data = {
        pageNo: pageNo,
       pageSize: 9999,
      };
      postData("/member/findMyAddress", data).then(res => {
        this.resultData = res.result.resultList;
        this.setAddressList(JSON.stringify(this.resultData)); // 给 vuex 赋值
      });
    }
  },
  // 计算属性
  computed: {},
  // 注册子组件
  components: {},
  // 实例化之前
  created() {
    this.findMyAddress(1);
  },
  // 监听
  watch: {
    // 监听获取数据的变化 从字符串转为对象并赋值给 resultData
    $route(n, o) {
      if (o.path.indexOf('edit-address')!==-1||o.path.indexOf('add-address')!==-1) {
        this.findMyAddress(1);
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";
.address-container {
  @include size(100%, auto);
  @include box-sizing;
  padding: 30px 30px 0;
  margin: 0 auto;
}

.address-wrap {
  @include size(100%, auto);
  background: #fff;
  border-radius: 10px;
  @include box-sizing;
  padding: 0 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  margin: 0 0 30px 0;
  transition: all 0.2s ease;

  .address-info {
    @include size(100%, auto);
    border-bottom: 1px solid #ddd;
    @include box-sizing;
    padding: 25px 0 25px 0;

    p:nth-of-type(1) {
      @include size(100%, 56px);
      @include font(28px, 56px, normal, left, #333);

      span {
        margin-right: 30px;
      }
    }
    p:nth-of-type(2) {
      @include size(100%, auto);
      @include font(24px, 50px, normal, left, #999);
    }
    p:nth-of-type(3) {
      @include size(100%, 58px);
      @include font(24px, 58px, normal, left, #999);
    }
  }
}
.address-state {
  @include size(100%, 100px);

  p {
    display: inline-block;
    float: left;
  }

  p:nth-of-type(1) {
    @include size(190px, 100px);

    .icon-gou {
      display: inline-block;
      @include size(40px, 40px);
      margin: 28px 10px 0 0;
      @include font(40px, 40px, normal, center, #fff);
      border-radius: 50%;
      border: 2px solid #acacac;
      background: #fff;
      float: left;
    }

    span {
      display: inline-block;
      height: 100px;
      @include font(26px, 100px, normal, left, #666);
      float: left;
    }
  }
  p:nth-of-type(1).active {
    i.icon-gou {
      border: 2px solid #8ec25a;
      background: #8ec25a;
    }
  }

  p:nth-of-type(2),
  p:nth-of-type(3) {
    @include size(126px, 100px);
    float: right;
    i.icon-shanchu,
    i.icon-tubiao {
      display: block;
      @include size(40px, 40px);
      float: left;
      @include font(40px, 40px, normal, center, #999);
    }
    i.icon-shanchu {
      margin: 30px 0 0 30px;
    }
    i.icon-tubiao {
      margin: 30px 10px 0 0;
    }
    i.icon-tubiao ~ span {
      float: left;
    }
    span {
      display: inline-block;
      height: 100px;
      @include font(26px, 100px, normal, left, #666);
      float: right;
    }
  }
  p:nth-of-type(2) {
    position: $rela;
  }
  p:nth-of-type(2):before {
    display: block;
    content: "";
    @include size(2px, 32px);
    background: #ddd;
    position: $abso;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto 0;
  }
  p:nth-of-type(3) {
    padding: 0 30px 0 0;
  }
}
.address-foot {
  @include size(100%, 100px);
  position: $fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  background: #eee;
  z-index: 50;
  box-shadow: 0 0 10px #333;
  @include box-sizing;
  padding: 0 30px;
  p {
    @include size(100%, 80px);
    border-radius: 60px;
    @include font(26px, 80px, normal, center, #fff);
    background: #8ec25a;
    margin: 10px 0 0 0;
  }
}
.del-hint-wrap {
  @include size(100%, 100%);
  position: $fixed;
  top: 0;
  left: -200%;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 101;
  background: rgba(0, 0, 0, 0.8);
  transition: all 0.2s ease;

  .del-hint-box {
    @include size(690px, 360px);
    background: #fff;
    border-radius: 10px;
    position: $abso;
    top: -200%;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    @include box-sizing;
    padding: 0 30px;
    transition: all 0.6s ease;

    h1 {
      @include size(100%, 112px);
      @include font(28px, 112px, normal, center, #333);
    }
    .content {
      @include size(100%, 64px);
      @include font(24px, 65px, normal, center, #666);
      margin-bottom: 60px;
    }
    .cancel,
    .delete {
      @include size(300px, 80px);
      border-radius: 80px;
      @include box-sizing;
    }
    .cancel {
      @include font(28px, 76px, normal, center, #999);
      border: 2px solid #aaa;
      background: #fff;
      float: left;
    }
    .delete {
      @include font(28px, 76px, normal, center, #fff);
      border: 2px solid #8ec25a;
      background: #8ec25a;
      float: right;
    }
  }
}
.del-hint-wrap.active {
  left: 0;
  .del-hint-box {
    top: 0;
  }
}
</style>