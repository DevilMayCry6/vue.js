<template>
    <div>
        <!-- <base-ckeckbox v-model="lovingVue"></base-checkbox> -->
        <text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
    </div>
</template>
<script>
export default {
    data(){
        return{
        $emit('update:title', newTitle)
        }
    }
    // component('base-checkbox', {
    //     model: {
    //         prop: 'checked',
    //         event: 'change'
    //     },
    //     props: {
    //         checked: Boolean
    //     },
    //     template: `
    //         <input
    //         type="checkbox"
    //         v-bind:checked="checked"
    //         v-on:change="$emit('change', $event.target.checked)"
    //         >
    //     `
    //     })
    
}
</script>