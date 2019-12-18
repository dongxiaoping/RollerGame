class ConfigManage {
    private isBackMusic: boolean = true //背景音乐是否开启
    private isTxMusic: boolean = true //特效音乐是否开启

    public setBackMusic(isOpen: boolean) {
        this.isBackMusic = isOpen
    }

    public setTxMusic(isOpen: boolean) {
        this.isTxMusic = isOpen
    }

    public isBackMusicOpen() {
        return this.isBackMusic
    }

    public isTxMusicOpen() {
        return this.isTxMusic
    }
}

export default new ConfigManage