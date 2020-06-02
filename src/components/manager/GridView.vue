<template>
    <div class="fm-grid">
        <div class="d-flex align-content-start flex-wrap">
            <div v-if="!isRootPath && selectedDirectory!=cuName" v-on:click="levelUp" class="fm-grid-item text-center" >
                <div class="fm-item-icon">
                    <i class="fas fa-level-up-alt fa-5x pb-2"></i>
                </div>
                <div class="fm-item-info"><strong>..</strong></div>
            </div>

            <div v-if="!isMobile()" class="fm-grid-item text-center unselectable"
                 v-for="(directory, index) in directories"
                 v-bind:key="`d-${index}`"
                 v-bind:title="directory.basename"
                 v-bind:class="{'active': checkSelect('directories', directory.path)}"
                 v-on:click="selectItem('directories', directory.path, $event)"
                 @mousedown="setMainDir(directory.path)"
                 v-on:dblclick.stop="selectDirectory(directory.path)"
                 v-on:contextmenu.prevent="contextMenu(directory, $event)">
                <div class="fm-item-icon">
                    <i class="fa-5x pb-2"
                       v-bind:class="(acl && directory.acl === 0) ? 'fas fa-unlock-alt' : 'far fa-folder'"></i>
                </div>
                <div class="fm-item-info">{{ directory.basename }}</div>
            </div>

            <div v-if="isMobile()" class="fm-grid-item text-center unselectable"
                 v-for="(directory, index) in directories"
                 v-bind:key="`d-${index}`"
                 v-bind:title="directory.basename"
                 v-bind:class="{'active': checkSelect('directories', directory.path)}"
                 v-on:mousedown = "setMainDir(directory.path)"
                 v-on:click.stop="selectDirectory(directory.path)"
                 v-on:contextmenu.prevent="contextMenu(directory, $event)">
                <div class="fm-item-icon">
                    <i class="fa-5x pb-2"
                       v-bind:class="(acl && directory.acl === 0) ? 'fas fa-unlock-alt' : 'far fa-folder'"></i>
                </div>
                <div class="fm-item-info">{{ directory.basename }}</div>
            </div>


            <div v-if="!isMobile()" class="fm-grid-item text-center unselectable"
                 v-for="(file, index) in files"
                 v-bind:key="`f-${index}`"
                 v-bind:title="file.basename"
                 v-bind:class="{'active': checkSelect('files', file.path)}"
                 v-on:click="selectItem('files', file.path, $event)"
                 v-on:dblclick="selectAction(file.path, file.extension)"
                 v-on:contextmenu.prevent="contextMenu(file, $event)">
                <div class="fm-item-icon">
                    <i v-if="acl && file.acl === 0" class="fas fa-unlock-alt fa-5x pb-2"></i>
                    <thumbnail v-else-if="thisImage(file.extension)"
                               v-bind:disk="disk"
                               v-bind:file="file">
                    </thumbnail>
                    <i v-else class="far fa-5x pb-2"
                       v-bind:class="extensionToIcon(file.extension)"></i>
                </div>
                <div class="fm-item-info">
                    {{ `${file.filename}.${file.extension}` }}
                    <br>
                    {{ bytesToHuman(file.size) }}
                </div>
            </div>

            <div v-if="isMobile()" class="fm-grid-item text-center unselectable"
                 v-for="(file, index) in files"
                 v-bind:key="`f-${index}`"
                 v-bind:title="file.basename"
                 v-bind:class="{'active': checkSelect('files', file.path)}"
                 v-on:mousedown="selectItem('files', file.path, $event)"
                 v-on:dblclick="selectAction(file.path, file.extension)"
                 v-on:contextmenu.prevent="contextMenu(file, $event)">
                <div class="fm-item-icon">
                    <i v-if="acl && file.acl === 0" class="fas fa-unlock-alt fa-5x pb-2"></i>
                    <thumbnail v-else-if="thisImage(file.extension)"
                               v-bind:disk="disk"
                               v-bind:file="file">
                    </thumbnail>
                    <i v-else class="far fa-5x pb-2"
                       v-bind:class="extensionToIcon(file.extension)"></i>
                </div>
                <div class="fm-item-info">
                    {{ `${file.filename}.${file.extension}` }}
                    <br>
                    {{ bytesToHuman(file.size) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import translate from './../../mixins/translate';
import helper from './../../mixins/helper';
import managerHelper from './mixins/manager';
import Thumbnail from './Thumbnail.vue';
import { mapGetters } from 'vuex';
import generalStore from './../../store/state';

export default {
  name: 'grid-view',
  components: { Thumbnail },
  mixins: [translate, helper, managerHelper],
  data() {
    return {
      disk: '',
      cuName:'',
      mainDir:'',
      flag: false,
    };
  },
  props: {
    manager: { type: String, required: true },
  },
  mounted() {
    this.disk = this.selectedDisk;
  },
  beforeUpdate() {
    // if disk changed
    if (this.disk !== this.selectedDisk) {
      this.disk = this.selectedDisk;
    }
  },
  computed: {
     ...mapGetters('fm',{
				selectedDirectory:'selectedDirectory'
        }),
    ...mapGetters('auth',{
				currentUser: 'currentUser'
        }),
    /**
     * Image extensions list
     * @returns {*}
     */
    imageExtensions() {
      return this.$store.state.fm.settings.imageExtensions;
    },
  },
  created() {
       if(this.currentUser.id_cu==0){
          if(this.currentUser.can['index_disk_cu']){
              this.cuName='';   
          }else{
              this.cuName='BKCU';
          }
      }else{
          this.cuName = this.currentUser.cu.name;
      }
  },
  methods: {
    /**
     * Check file extension (image or no)
     * @param extension
     * @returns {boolean}
     */
    setMainDir(directory){
         if(this.currentUser.id_cu==0){
            if(this.selectedDirectory==null){
            this.flag=false;
        }

        if(!this.flag){
            this.mainDir = directory;
            this.flag = true;
        }
        generalStore.mainDir = this.mainDir;
        }
    },
    thisImage(extension) {
      // extension not found
      if (!extension) return false;

      return this.imageExtensions.includes(extension.toLowerCase());
    },
    isMobile() {
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true
        } else {
            return false
        }
    },
  },
};
</script>

<style lang="scss">
    .fm-grid {
        padding-top: 1rem;

        .fm-grid-item {
            position: relative;
            width: 125px;
            padding: 0.4rem;
            margin-bottom: 1rem;
            margin-right: 1rem;
            border-radius: 5px;

            &.active {
                background-color: #c2e5eb;
                box-shadow: 3px 2px 5px gray;
            }

            &:not(.active):hover {
                background-color: #f8f9fa;
                box-shadow: 3px 2px 5px gray;
            }

            .fm-item-icon{
                cursor: pointer;
            }

            .fm-item-icon > i,
            .fm-item-icon > figure > i {
                color: #6d757d;
            }

            .fm-item-info {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
</style>
