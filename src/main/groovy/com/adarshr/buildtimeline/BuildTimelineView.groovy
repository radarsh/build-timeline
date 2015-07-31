package com.adarshr.buildtimeline

import hudson.Extension
import hudson.model.AbstractProject
import hudson.model.ViewDescriptor
import hudson.util.ListBoxModel
import jenkins.model.Jenkins
import net.sf.json.JSONObject
import org.kohsuke.stapler.DataBoundConstructor
import org.kohsuke.stapler.StaplerRequest
import org.kohsuke.stapler.bind.JavaScriptMethod

import static hudson.Functions.getResourcePath
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

    @JavaScriptMethod
    JSONObject getTimelineData() {
        List rows = []
        BuildMetadata.oldest = 0
        addDownstreamProjects(upstreamProject, rows)
        [rows: rows.sort { it.start }]
    }

    String getResources() {
        "$resourcePath/plugin/build-timeline"
    }

    private AbstractProject getUpstreamProject() {
        Jenkins.instance.getItem(upstreamJob, Jenkins.instance, AbstractProject)
    }

    private void addDownstreamProjects(AbstractProject startProject, List rows = []) {
        rows << new BuildMetadata(startProject).data

        startProject.downstreamProjects?.each {
            addDownstreamProjects(it, rows)
        }
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
