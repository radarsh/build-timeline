package com.adarshr.buildtimeline;

import java.io.IOException;
import java.util.Collection;

import javax.servlet.ServletException;

import hudson.Extension;
import hudson.model.Item;
import hudson.model.TopLevelItem;
import hudson.model.View;
import hudson.model.ViewDescriptor;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.StaplerRequest;
import org.kohsuke.stapler.StaplerResponse;

public class BuildTimelineView extends View {

    public final String startJob;

    @DataBoundConstructor
    public BuildTimelineView(String name, String startJob) {
        super(name);
        this.startJob = startJob;
    }

    @Override
    public Collection<TopLevelItem> getItems() {
        return null;
    }

    @Override
    public boolean contains(TopLevelItem item) {
        return false;
    }

    @Override
    protected void submit(StaplerRequest req) throws IOException, ServletException, Descriptor.FormException {

    }

    @Override
    public Item doCreateItem(StaplerRequest req, StaplerResponse rsp) throws IOException, ServletException {
        return null;
    }

    @Extension
    public static final class Descriptor extends ViewDescriptor {

        @Override
        public String getDisplayName() {
            return "Build Timeline View";
        }
    }
}
