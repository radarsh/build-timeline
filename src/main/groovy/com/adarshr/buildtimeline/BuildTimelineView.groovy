package com.adarshr.buildtimeline

import hudson.Extension
import hudson.model.ViewDescriptor
import hudson.util.ListBoxModel
import jenkins.model.Jenkins
import org.kohsuke.stapler.DataBoundConstructor
import org.kohsuke.stapler.StaplerRequest

import static hudson.util.ListBoxModel.Option

class BuildTimelineView extends AbstractView {

    String upstreamJob

    @DataBoundConstructor
    BuildTimelineView(String name, String upstreamJob) {
        super(name)
        this.upstreamJob = upstreamJob
    }

    @Override
    protected void submit(StaplerRequest req) {
        upstreamJob = req.submittedForm.upstreamJob
    }

    @Extension
    static final class Descriptor extends ViewDescriptor {
        String displayName = 'Build Timeline View'

        ListBoxModel doFillUpstreamJobItems() {
            Jenkins.instance.jobNames.collect {
                new Option(it, it)
            }
        }
    }
}
