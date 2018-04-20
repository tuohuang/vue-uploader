Vue.component('uploader', {
    template: `<div class="uploader-box">
                    <ul class="files flexbox" id="uploaderFiles">
                        <li class="file" v-for="previewImg ,index in previewList" :key="index">
                            <span class="del" @click="delImg(index)">-</span>
                            <img :src="previewImg"></img>
                        </li>
                        <li class="uploader_input-box" id="uploader_input-box" v-if="previewList.length<=maxNum-1">
                            <input id="uploaderInput" @change="uploader" class="uploader_input" type="file" accept="image/*" multiple="">
                        </li>
                    </ul>
                    <input type="hidden" v-for="uploaderImg ,index in uploaderList" v-model="uploaderImg">
                </div>`,
    props: ['action', 'maxSize', 'maxNum', 'previewList', 'uploaderList'],
    methods: {
        uploader: function () {
            fileInput = document.getElementById('uploaderInput');
            if (fileInput.files.length + this.previewList.length > this.maxNum) {
                alert('最多还能上传' + (this.maxNum - this.previewList.length) + '张图片')
                return false;
            }
            for (i = 0; i < fileInput.files.length; i++) {
                var file = fileInput.files[i];
                var maxSize = file.maxSize;
                if (maxSize >= this.maxSize * 1024 * 1024) {
                    alert('图片不能超过' + this.maxSize + 'M')
                    return false;
                }
                if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
                    alert('不是有效的图片文件!')
                    return false;
                }
                // 读取文件
                const reader = new FileReader();
                const _this = this;
                reader.onload = function (e) {
                    var data = e.target.result;
                    _this.previewList = _this.previewList.concat(data)
                    _this.$http.post(this.action, { data: data }).then(function (res) { //上传
                        if (res.data.code == 1) {
                            this.uploaderList = this.uploaderList.concat(res.data.data)
                        } else {
                            this.uploaderList = this.uploaderList.concat('')
                        }
                    }, function () {
                        this.uploaderList = this.uploaderList.concat('')
                    })
                };
                reader.readAsDataURL(file);
            }
        },
        delImg: function (index) {
            this.previewList.splice(index, 1);
            this.uploaderList.splice(index, 1);
        }
    }
})