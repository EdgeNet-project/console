import React from "react";
import {Route, Switch} from "react-router-dom";
import AuthorityList from "../views/admin/AuthorityList";
import UserList from "../views/admin/UserList";
import UserView from "../views/admin/UserView";
import SliceList from "../views/admin/SliceList";

const ClusterAdminRoutesMain = () =>
    <Switch>
        <Route exact path="/admin/authorities">
            <AuthorityList />
        </Route>
        <Route path="/admin/users/:namespace?/:name?">
            <UserList />
        </Route>
        <Route exact path="/admin/slices">
            <SliceList />
        </Route>
    </Switch>;

const ClusterAdminRoutesView = () =>
    <Switch>
        <Route exact path="/admin/authorities">
        </Route>
        <Route path="/admin/users/:namespace/:name">
            <UserView />
        </Route>
        <Route exact path="/admin/slices">
        </Route>
    </Switch>;

export { ClusterAdminRoutesMain, ClusterAdminRoutesView };