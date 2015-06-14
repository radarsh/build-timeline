package com.adarshr.buildtimeline

import groovy.json.JsonOutput
import hudson.Extension
import hudson.model.AbstractProject
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

    String getRows() {
        Map rows = [:]
        addDownstreamProjects(upstreamProject, rows)
        JsonOutput.toJson(rows)
    }

    private AbstractProject getUpstreamProject() {
        Jenkins.instance.getItem(upstreamJob, Jenkins.instance, AbstractProject)
    }

    private void addDownstreamProjects(AbstractProject startProject, Map rows) {
        rows[startProject.name] = getBuildMetadata(startProject)
        startProject.downstreamProjects.collect {
            addDownstreamProjects(it, rows)
            rows[it.name] = getBuildMetadata(it)
        }
    }

    private List getBuildMetadata(AbstractProject project) {
        [
            project.lastSuccessfulBuild.number.toString(),
            project.name,
            project.lastSuccessfulBuild.startTimeInMillis,
            project.lastSuccessfulBuild.startTimeInMillis + project.lastSuccessfulBuild.duration
        ]
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
