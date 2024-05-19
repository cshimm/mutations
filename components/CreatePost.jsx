import {useMutation} from "@tanstack/react-query";
import {Pressable, Text, View} from "react-native";
import {styles} from '../styles'

export function CreatePost({queryClient}) {
    const mutation = useMutation({
        mutationKey: ['posts'],
        mutationFn: (newTodo) => {
            return fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify(newTodo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then((response) => response.json())
        },
        onSuccess: () => {
            queryClient.invalidateQueries('posts');
        }
    })
    return (
        <View style={[styles.flexContainer, styles.contentContainer, styles.padding]}>
            {mutation.isPending ? (
                <Text>'Adding post...'</Text>
            ) : (
                <>
                    {mutation.isError ? (
                        <Text>An error occurred: {mutation.error.message}</Text>
                    ) : null}

                    {mutation.isSuccess ? <Text>Todo added!</Text> : null}

                    <Pressable
                        onPress={() => {
                            mutation.mutate({id: new Date(), title: 'New post'})
                        }}
                    >
                        <Text style={styles.buttonText}>Create Post</Text>
                    </Pressable>
                </>
            )}
        </View>
    )
}

