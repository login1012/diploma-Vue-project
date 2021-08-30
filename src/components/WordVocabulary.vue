<template>
  <div>
    <template v-if="words!=null">
      <v-card
          width="70vw"
          class="my-4"
          v-for="(value, property) in words" :key="property"
      >
        <v-row align="center">
          <v-col class="ml-4">
            <v-checkbox
                label="Тренировка"
                color="red"
                hide-details
                v-model="checked_words_id"
                @click="choose_word"
                :value="value"
                :disabled="amount_check"
            ></v-checkbox>
          </v-col>
          <v-col align="center">
            <v-card-text>
              <p class="display-1 text--primary"
              >
                {{value.word}}
              </p>
              <v-divider class="black"></v-divider>
              <p class="mt-4">{{value.translation}}</p>
            </v-card-text>
          </v-col>
          <v-col align="center" align-self="center">
            <v-card-text>
              <div class="text--primary">
               <ul>
                  <li v-for="(association_value, name) in value.association" :key="name">
                      {{ association_value.association }}
                  </li>
                </ul>
              </div>
            </v-card-text>
          </v-col>
          <v-col align="center">
            <v-btn
                class="ma-2"
                fab
                small
                outlined
                color="red"
                :disabled="checked"
                @click="delete_from_vocabulary(property)">
              <v-icon dark>
                mdi-delete
              </v-icon>
            </v-btn>
            <v-btn
                rounded
                text
                color="red"
                class="ma-2"
                :to="{name:'WordInfo', params:{id:property}}"
            >
              Просмотреть данные о слове
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </template>
    <template v-else>
      <v-card
          width="70vw"
          class="my-4"
          align="center"
      >
        <v-card-text>
          <p class="display-1 text--primary font-weight-thin"
          >
            В словаре пока нет слов
          </p>
        </v-card-text>
      </v-card>
    </template>

    <v-snackbar
        v-model="snackbar"
    >
      Для тренировки можно выбрать не более {{amount}} слов
      <template v-slot:action="{ attrs }">
        <v-btn
            color="red"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          ОК
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "WordVocabulary",
  data(){
    return{
      checked_words_id:[],
      amount: 5,
      amount_check: false,
      snackbar: false,
      checked: false
    }
  },
  computed:{
    words(){
      if(this.$store.getters.get_words_keys!=0)
        return this.$store.getters.get_words
      else return null
    },
    training_words_list_length(){
      return this.$store.getters.get_training_words_length
    }
  },
  watch:{
    training_words_list_length(val){
      if(val>0) {
        this.checked = true
        this.amount_check = false
        if (val === this.amount) {
          this.amount_check = true
          this.snackbar = true
        }
      }
      else{
        this.checked = false
        this.amount_check = false
      }
    }
  },
  methods:{
    choose_word(){
      this.$store.dispatch('set_training_words', this.checked_words_id)
    },
    delete_from_vocabulary(payload){
          this.$store.dispatch('delete_user_data_word_by_id', payload)
    }
  },
}
</script>

<style scoped>

</style>