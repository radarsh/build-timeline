package com.adarshr.buildtimeline

import hudson.Extension
import hudson.model.Item
import hudson.model.TopLevelItem
import hudson.model.View
import hudson.model.ViewDescriptor
import org.kohsuke.stapler.DataBoundConstructor
import org.kohsuke.stapler.StaplerRequest
import org.kohsuke.stapler.StaplerResponse

class BuildTimelineView extends View {

    final String startJob

    @DataBoundConstructor
    BuildTimelineView(String name, String startJob) {
        super(name)
        this.startJob = startJob
    }

    @Override
    Collection<TopLevelItem> getItems() {
        null
    }

    @Override
    boolean contains(TopLevelItem item) {
        false
    }

    @Override
    protected void submit(StaplerRequest req) {

    }

    @Override
    Item doCreateItem(StaplerRequest req, StaplerResponse rsp) {
        null
    }

    @Extension
    static final class Descriptor extends ViewDescriptor {
        String displayName = 'Build Timeline View'
    }
}