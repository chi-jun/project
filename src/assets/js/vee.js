import Vue from 'vue'
// import VeeValidate, { Validator } from 'vee-validate'
// import zh from 'vee-validate/dist/locale/zh_CN';//引入中文文件

// // 配置中文
// Validator.addLocale(zh);

// const config = {
//     locale: 'zh_CN'
// };



// // 自定义validate
// const dictionary = {
//     zh_CN: {
//         messages: {
//             required: (field) => "请输入或选择" + field
//         },
//         attributes: {
//             email: '邮箱',
//             mobPhone: '联系电话',
//             zipCode: '邮编',
//             consignee: '收货人',
//             address:'所在地区'
//         }
//     }
// };

// Validator.updateDictionary(dictionary);

// Validator.extend('mobPhone', {
//     messages: {
//         zh_CN: field => field + '格式不正确',
//     },
//     validate: value => {
//         return /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
//     }
// });
// Validator.extend('zipCode', {
//     messages: {
//         zh_CN: field => field + '格式不正确',
//     },
//     validate: value => {
//         return /^[0-9]{6}$/.test(value)
//     }
// });

// Validator.extend('checkRadio', {
//     messages: {
//         zh_CN: field => '请选择' + field,
//     },
//     validate: value => {
//         return value !== '';
//     }
// });
// Vue.use(VeeValidate, config);
// 引入验证规则
var SimpleVueValidation = require('simple-vue-validator');
var Validator = SimpleVueValidation.Validator;
Vue.use(SimpleVueValidation, {
    templates: {
        required: '必填',
        email: '格式不正确',
        regex: '格式不正确',
        integer:'格式不正确',
        length: '格式不正确',
    }
})