import {useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Pressable, ScrollView, Text, TextInput, View} from "react-native";
import {styles} from '../styles'

export function FetchPosts({queryClient}) {
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
        const [title, onChangeTitle] = useState('');
        const [body, onChangeBody] = useState('');
        const mutation = useMutation({
            mutationKey: ['posts'],
            mutationFn: (editedPost) => {
                return fetch(`https://jsonplaceholder.typicode.com/posts/${editedPost.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(editedPost),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }).then((response) => response.json())
            },
            onSuccess: () => {
                queryClient.invalidateQueries('posts');
            }
        })

        function handleSubmit(id) {
            mutation.mutate({id, title, body})
            setEditPostId(undefined)
        }

        return <View style={[styles.horizontalFlex, styles.centered]}>
            <Text>New Title</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeTitle}
                value={title}
            />
            <Text>New Body</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeBody}
                value={body}
            />
            <Pressable onPress={() => handleSubmit(editPostId)}>
                <Text style={styles.buttonText}>Submit</Text>
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