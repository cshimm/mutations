import {useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Pressable, ScrollView, Text, View} from "react-native";
import {styles} from '../styles'
import {EditForm} from "./EditForm";

export function FetchPosts({queryClient}) {
    const [editPostId, setEditPostId] = useState(undefined);
    const {isFetching, error, data} = useQuery({
        queryKey: ['posts'],
        queryFn: () =>
            fetch('https://jsonplaceholder.typicode.com/posts').then((res) => {
                return res.json()
            }),
    })
    const mutation = useMutation({
        mutationKey: ['posts'],
        mutationFn: (deletedPost) => {
            return fetch(`https://jsonplaceholder.typicode.com/posts/${deletedPost.id}`, {
                method: 'DELETE',
            }).then((response) => response.json())
        },
        onSuccess: () => {
            queryClient.invalidateQueries('posts');
        }
    })
    function handleEditPressed(id) {
        setEditPostId(id)
    }
    function handleDeletePressed(id) {
        mutation.mutate({id})
    }
    if (isFetching) return <Text>'Loading...'</Text>
    if (error) return <Text>{'An error has occurred: '}</Text>

    return (
        <ScrollView contentContainerStyle={[styles.contentContainer]}>
            {
                editPostId !== undefined && (
                    <EditForm
                        id={editPostId}
                        queryClient={queryClient}
                        editPostId={editPostId}
                        setEditPostId={setEditPostId}
                    />
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
                        <Pressable
                            onPress={() => handleDeletePressed(post.id)}
                            style={[{alignItems: 'flex-end'}, {height: 'fit-content'}]}>
                            <Text style={[styles.buttonText]}>Delete</Text>
                        </Pressable>
                    </View>
                })
            }
        </ScrollView>
    )
}