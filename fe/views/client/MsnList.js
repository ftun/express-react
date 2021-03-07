import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
}));

const AlignItemsList = props => {
  const classes = useStyles();

  return <List className={classes.root}>
            {props.data.map((msn, idx) => {
                return <React.Fragment key={idx}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar>{msn.username.charAt(0).toUpperCase()}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary="-----"
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                >
                                {msn.username}
                            </Typography>
                            {' - ' + msn.body}
                            </React.Fragment>
                        }/>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </React.Fragment>
            })}
        </List>
    ;
};

export default AlignItemsList;
