import {createStyles, PasswordInput} from "@mantine/core";

const useStyles = createStyles((theme) => ({
    // root: {
    //     position: 'relative',
    // },

    wrapper: {
        position: 'relative',
        height: 56,
        // paddingTop: 18,
    },

    innerInput: {
        height: 56,
        paddingTop: 18,
    },

    input: {
        height: 54,
        paddingTop: 18,
    },

    rightSection: {
        height: 'auto',
        paddingTop: 18,
    },

    label: {
        position: 'absolute',
        pointerEvents: 'none',
        fontSize: theme.fontSizes.xs,
        paddingLeft: theme.spacing.sm,
        paddingTop: theme.spacing.sm / 2,
        zIndex: 1,
    },

}));

export default (props) => {
    const { classes } = useStyles();

    return <PasswordInput classNames={classes} {...props} />
}