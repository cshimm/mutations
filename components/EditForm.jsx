import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {Pressable, Text, TextInput, View} from "react-native";
import {styles} from "../styles";

export const EditForm = ({queryClient, editPostId, setEditPostId}) => {
    const [title, onChangeTitle] = useState('');
    const [body, onChangeBody] = useState('');
    const updateMutation = useMutation({
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
    const patchMutation = useMutation({
        mutationKey: ['posts'],
        mutationFn: (editedPost) => {
            return fetch(`https://jsonplaceholder.typicode.com/posts/${editedPost.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title: editedPost.title,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }).then((response) => response.json())
        },
        onSuccess: () => {
            queryClient.invalidateQueries('posts');
        }
    });

    function handleSubmit(id) {
        if (body === '')
            patchMutation.mutate({id, title})
        else
            updateMutation.mutate({id, title, body})
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