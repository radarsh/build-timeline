package com.adarshr.buildtimeline

import hudson.model.Item
import hudson.model.TopLevelItem
import hudson.model.View
import org.kohsuke.stapler.StaplerRequest
import org.kohsuke.stapler.StaplerResponse

abstract class AbstractView extends View {

    protected AbstractView(String name) {
        super(name)
    }

    @Override
    Collection<TopLevelItem> getItems() {
        println "AbstractView.getItems"
        null
    }

    @Override
    boolean contains(TopLevelItem item) {
        println "AbstractView.contains"
        false
    }

    @Override
    Item doCreateItem(StaplerRequest req, StaplerResponse rsp) {
        println "BuildTimelineView.doCreateItem"
        null
    }
}
