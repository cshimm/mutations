import {useEffect, useRef, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Pressable, ScrollView, Text, TextInput, View} from "react-native";
import {styles} from '../styles'
import {EditForm} from "./EditForm";

export function FetchPosts({queryClient}) {
    const [editPostId, setEditPostId] = useState(undefined);
    const [filterText, setFilterText] = useState('');
    const textInputRef = useRef(null);
    useEffect(() => {
        const timer = setTimeout(() => {
            focusFilterTextInput()
        }, 100);

        return () => clearTimeout(timer);
    }, [filterText]);
    const {isFetching, error, data} = useQuery({
        queryKey: ['posts', filterText],
        queryFn: () => {
            const endpoint = filterText === '' ? 'https://jsonplaceholder.typicode.com/posts' :
                `https://jsonplaceholder.typicode.com/users/${filterText}/posts`
            return fetch(endpoint).then((res) => {
                return res.json()
            });
        },
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
            focusFilterTextInput()
        }
    })

    function focusFilterTextInput() {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    }

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
            <View style={[styles.horizontalFlex, styles.centered]}>
                <Text>Filter posts by user:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setFilterText}
                    value={filterText}
                    keyboardType={'numeric'}
                    ref={textInputRef}
                />
                <Pressable onPress={() => setFilterText('')}>
                    <Text style={styles.buttonText}>Clear Filter</Text>
                </Pressable>
            </View>
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
                filterText !== '' &&
                <Text style={[{fontSize: 30, marginBottom: 15}]}>Posts by user {filterText}:</Text>
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