import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
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
    centered: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    verticalFlex: {
        flex: 1,
        flexDirection: 'column',
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