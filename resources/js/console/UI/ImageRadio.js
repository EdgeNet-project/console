import {
    UnstyledButton,
    Checkbox,
    Text,
    Image,
    SimpleGrid,
    createStyles,
    rem,
} from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';

const useStyles = createStyles((theme, { checked }) => ({
    button: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        transition: 'background-color 150ms ease, border-color 150ms ease',
        border: `${rem(1)} solid ${
            checked
                ? theme.fn.variant({ variant: 'outline', color: theme.primaryColor }).border
                : theme.colorScheme === 'dark'
                    ? theme.colors.dark[8]
                    : theme.colors.gray[3]
        }`,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.sm,
        backgroundColor: checked
            ? theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.white,
    },

    body: {
        flex: 1,
        marginLeft: theme.spacing.md,
    },
}));
//
// interface ImageCheckboxProps {
//     checked?: boolean;
//     defaultChecked?: boolean;
//     onChange?(checked: boolean): void;
//     title: string;
//     description: string;
//     image: string;
// }

export function ImageRadio({
                                  checked,
                                  defaultChecked,
                                  onChange,
                                  title,
                                  description,
                                  className,
                                  image,
                                  ...others
                              }) {
    const [value, handleChange] = useUncontrolled({
        value: checked,
        defaultValue: defaultChecked,
        finalValue: false,
        onChange,
    });

    const { classes, cx } = useStyles({ checked: value });

    return (
        <UnstyledButton
            className={classes.button}
        >
            <Image src={image} alt={title} width={40} />

            <div className={classes.body}>
                <Text color="dimmed" size="xs" sx={{ lineHeight: 1 }} mb={5}>
                    {description}
                </Text>
                <Text weight={500} size="sm" sx={{ lineHeight: 1 }}>
                    {title}
                </Text>
            </div>

            <Checkbox
                checked={value}
                onChange={() => {}}
                tabIndex={-1}
                styles={{ input: { cursor: 'pointer' } }}
            />
        </UnstyledButton>
    );
}