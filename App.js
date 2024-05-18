import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {QueryClient, QueryClientProvider, useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useState} from "react";

export default function App() {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <FetchPosts queryClient={queryClient}/>
            <CreatePost queryClient={queryClient}/>
        </QueryClientProvider>
    )
}

function FetchPosts({queryClient}) {
    const [editPostId, setEditPostId] = useState(undefined);
    const {isFetching, error, data} = useQuery({
        queryKey: ['posts'],
        queryFn: () =>
            fetch('https://jsonplaceholder.typicode.com/posts').then((res) => {
                return res.json()
            }),
    })

    function handleEditPressed(id) {
        setEditPostId(id)
    }

    if (isFetching) return <Text>'Loading...'</Text>
    if (error) return <Text>{'An error has occurred: '}</Text>

    const EditForm = () => {
        const [text, onChangeText] = useState('');
        const mutation = useMutation({
            mutationKey: ['posts'],
            mutationFn: (editedPost) => {
                console.log(editedPost)
                return fetch(`https://jsonplaceholder.typicode.com/posts/${editedPost.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(editedPost),
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
        function handleSubmit(id) {
            mutation.mutate({id: id, title: text})
            setEditPostId(undefined)
        }

        return <View style={[styles.horizontalFlex]}>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
            />
            <Pressable onPress={() => handleSubmit(editPostId)}>
                <Text>Submit</Text>
            </Pressable>
        </View>
    }
    return (
        <ScrollView contentContainerStyle={[styles.contentContainer]}>
            {
                editPostId !== undefined && (
                    <EditForm id={editPostId}/>
                )
            }
            {
                data.map(post => {
                    return <View style={styles.horizontalFlex} key={post.id}>
                        <View style={styles.verticalFlex}>
                            <Text style={{fontWeight: 'bold'}}>{post.title}</Text>
                            <Text>{post.body}</Text>
                        </View>
                        <Pressable
                            onPress={() => handleEditPressed(post.id)}
                            style={[{alignItems: 'flex-end'}, {height: 'fit-content'}]}>
                            <Text style={[styles.buttonText]}>Edit</Text>
                        </Pressable>
                    </View>
                })
            }
        </ScrollView>
    )
}

function CreatePost({queryClient}) {
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
                <Text>'Adding todo...'</Text>
            ) : (
                <>
                    {mutation.isError ? (
                        <Text>An error occurred: {mutation.error.message}</Text>
                    ) : null}

                    {mutation.isSuccess ? <Text>Todo added!</Text> : null}

                    <Pressable
                        onPress={() => {
                            mutation.mutate({id: new Date(), title: 'Do Laundry'})
                        }}
                    >
                        <Text style={styles.buttonText}>Create Todo</Text>
                    </Pressable>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    horizontalFlex: {
        flex: 1,
        flexDirection: 'row',
        gap: 5,
        width: '100%'
    },
    verticalFlex: {
        flex: 1,
        flexDirection: 'column',
        // gap: 5
    },
    padding: {
        padding: 50
    },
    buttonText: {
        fontSize: 18,
        color: 'blue',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

});
