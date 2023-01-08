<template>
    <v-data-table :headers="headers" :items="desserts" class="elevation-1">
        <template v-slot:header.name="{ header }">
     <td>{{ header.text}}</td>
     <td>{{ header.text}}</td>
     <td>{{ header.text}}</td>
     <td>{{ header.text}}</td>
     <td>{{ header.text}}</td>
     <td>{{ header.text}}</td>
            <td><v-icon>mdi-check-circle</v-icon></td>
        </template>
    </v-data-table>
</template>

<script>
export default {
    data: () => ({
        headers: [
            {
                text: 'Dessert (100g serving)',
                align: 'start',
                value: 'name',
            },
            { text: 'Calories', value: 'calories' },
            { text: 'Fat (g)', value: 'fat' },
            { text: 'Carbs (g)', value: 'carbs' },
            { text: 'Protein (g)', value: 'protein' },
            { text: 'Iron (%)', value: 'iron' },
        ],
    //     desserts: [
    //         {
    //             name: 'Frozen Yogurt',
    //             calories: 159,
    //             fat: 6.0,
    //             carbs: 24,
    //             protein: 4.0,
    //             iron: '1%',
    //         },
    //   ],
    }),
}
</script>