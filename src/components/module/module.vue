<template>
	<div class="container clearfix">
		<v-header></v-header>
        <!-- keep-alive 将加载过的页面缓存下来 -->
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
		<v-footer></v-footer>
	</div>
</template>

<script>
    import VHeader from '@/components/header/header'
    import VFooter from '@/components/footer/footer'
    export default {
        components: {
          VHeader,
          VFooter
        }
    }
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
    .container {
        padding: 86px 0 100px 0;
        width: 100%;
        height: 100%;
    }
</style>
