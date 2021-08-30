import Vue from 'vue'
let defaultUserData = {
    words:{}
}
export default{
    state: {
        userData:defaultUserData
    },
    mutations: {
        set_user_data_words(state, payload){
            state.userData.words = payload
        },
        add_user_data_word(state, payload) {
            Vue.set(state.userData.words, payload.wordId, payload.word)
        },
        delete_user_data_word_by_id(state, payload){
            Vue.delete(state.userData.words, payload)
        },
        /*add_word(state, payload){
            state.words.push(payload)
        },*/
        /*delete_word(state, payload){
            state.words.splice(state.words.indexOf(payload), 1)
        },*/
      /*  delete_word_by_id(state, payload){
            /!*state.userData.words.splice(
                state.userData.words.findIndex(x => x.id===payload), 1)*!/
        },*/
        /*delete_user_data_word_association(state, {word_id, association_id}){
            state.words.find(x => x.id===word_id)
                .association
                .splice(
                    state.words.find(x => x.id===word_id)
                        .association.findIndex(x => x.id===association_id), 1)
        },*/
        delete_user_data_word_association(state, {word_id, association_id}){
            Vue.delete( state.userData.words[word_id]
                .association, association_id)
        },

        add_user_data_word_association(state, {word_id, association_id, association_object}){
            Vue.set( state.userData.words[word_id]
                .association, association_id, association_object)
        }
    },
    actions:{
        load_user_data({commit}, payload){
            commit('set_processing', true)
            let userDataRef = Vue.$db.collection('userdata').doc(payload).collection('words')
            let words = {}

            userDataRef.get()
                .then((data) => {
                    data.forEach((i) => {
                        Vue.set(words, i.id, i.data())
                        let association = {}
                        let address = i.id
                        let associationRef = userDataRef.doc(i.id).collection('association')
                        associationRef.get()
                            .then((associationDoc) =>{
                                associationDoc.forEach((k) => {
                                    Vue.set(association, k.id, k.data())
                                })
                            })
                        Vue.set(words[address], 'association', association)
                    })
                    commit('set_user_data_words', words)
                    commit('set_processing', false)
                        }).catch(() =>{
                            commit('set_processing', false)
            })
        },
        add_user_data_word({commit, getters}, payload){
            commit('set_processing', true)
            let wordsRef = Vue.$db.collection('userdata')
                .doc(getters.userId).collection('words').doc(payload.id)
            let word = {
                word: payload.word,
                translation: payload.translation,
                association: {},
                addedDate: new Date(),
                trainSuccess: {},
            }
            wordsRef.set(
                word,{merge: true})
                .then(() => {
                    commit('add_user_data_word', {wordId: payload.id, word: word})
                })
                .catch(() =>{
                    commit('set_processing', false)
                })
            commit('set_processing', false)
        },

        delete_user_data_word_by_id({commit, getters}, payload){
            commit('set_processing', true)
            let wordsRef = Vue.$db.collection('userdata')
                .doc(getters.userId).collection('words').doc(payload)
            wordsRef.delete()
                .catch(() =>{
                    commit('set_processing', false)
                })
            commit('delete_user_data_word_by_id', payload)
            commit('set_processing', false)
        },
        /*add_word({commit}, payload){
            commit('set_processing', true)
            commit('add_word', payload)
            commit('set_processing', false)
        },*/
       /* delete_word({commit}, payload){
            commit('set_processing', true)
            commit('delete_word', payload)
            commit('set_processing', false)
        },*/
        /*delete_word_by_id({commit}, payload){
            commit('set_processing', true)
            commit('delete_word_by_id', payload)
            commit('set_processing', false)
        },*/
        add_user_data_word_association({commit, getters}, {word_id, association_id, association_object}){
            commit('set_processing', true)
            let associationRef = Vue.$db.collection('userdata')
                .doc(getters.userId).collection('words').doc(word_id)
                .collection('association')
                .doc(association_id)
            let association = {
                association: association_object.association,
                authorId: association_object.authorId,
                addedDate: new Date()
            }
            associationRef.set(
                association,{merge: true })
                .then(() => {
                    commit('add_user_data_word_association', {word_id, association_id, association_object})
                })
                .catch(() =>{
                    commit('set_processing', false)
                })
            commit('set_processing', false)
        },
        delete_user_data_word_association({commit, getters}, {word_id, association_id}) {
            commit('set_processing', true)
            let associationRef = Vue.$db.collection('userdata')
                .doc(getters.userId).collection('words').doc(word_id)
                .collection('association')
                .doc(association_id)
            associationRef.delete()
                .then(() => {
                    commit('delete_user_data_word_association', {word_id, association_id})
                })
                .catch(() =>{
                    commit('set_processing', false)
                })
            commit('set_processing', false)
        }
    },
    getters: {
        get_words: (state) => state.userData.words,
        get_words_keys: (state) => (Object.keys(state.userData.words)),
        get_global_words_common(state, getters, rootState, rootGetters){
            return rootGetters.get_global_words
        }
    }
}
